"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutGrid, List, Loader2, PlusCircle, Search, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProjectCard } from "./project-card"

// Tạo component Select đơn giản để tránh phụ thuộc vào @radix-ui/react-select
const Select = ({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {children}
    </select>
  )
}

const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
  return <option value={value}>{children}</option>
}

interface Client {
  id: number
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
}

interface Project {
  id: number
  name: string
  code: string
  client?: Client | null
  clientId?: number | null
  location: string
  status: string
  progress: number
  budget: number
  startDate: string
  expectedEndDate: string
  _count?: {
    tasks: number
    stages: number
    members: number
    documents: number
  }
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreatingSample, setIsCreatingSample] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const fetchProjects = async () => {
    try {
      console.log("Client: Fetching projects...")
      setIsLoading(true)
      setError(null)

      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/projects?t=${timestamp}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      console.log("Client: Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Client: Error response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Client: Fetched projects:", data)

      if (Array.isArray(data)) {
        setProjects(data)
        setFilteredProjects(data)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        console.warn("Client: Unexpected response format:", data)
        setProjects([])
        setFilteredProjects([])
      }
    } catch (err) {
      console.error("Client: Error fetching projects:", err)
      setError(`Lỗi khi tải dự án: ${err instanceof Error ? err.message : String(err)}`)

      // Thử lấy thông tin debug
      try {
        const debugResponse = await fetch("/api/debug")
        const debugData = await debugResponse.json()
        console.log("Client: Debug info:", debugData)
        setDebugInfo(debugData)
      } catch (debugErr) {
        console.error("Client: Error fetching debug info:", debugErr)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (projects.length > 0) {
      let result = [...projects]

      // Lọc theo trạng thái
      if (statusFilter !== "all") {
        result = result.filter((project) => project.status.toLowerCase() === statusFilter.toLowerCase())
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        result = result.filter(
          (project) =>
            project.name.toLowerCase().includes(query) ||
            project.code.toLowerCase().includes(query) ||
            project.client?.name?.toLowerCase().includes(query) ||
            false ||
            project.location.toLowerCase().includes(query),
        )
      }

      setFilteredProjects(result)
    }
  }, [projects, statusFilter, searchQuery])

  const createSampleProject = async () => {
    try {
      setIsCreatingSample(true)
      console.log("Client: Creating sample project...")

      const sampleProject = {
        name: "Dự án mẫu " + new Date().toLocaleTimeString(),
        code:
          "DM" +
          Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0"),
        description: "Đây là dự án mẫu được tạo tự động",
        client: "Công ty ABC",
        contactName: "Nguyễn Văn A",
        email: "contact@abc.com",
        phone: "0123456789",
        address: "Hà Nội",
        location: "Hà Nội",
        startDate: new Date().toISOString(),
        expectedEndDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
        status: "PREPARING",
        budget: 1000000000,
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleProject),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const newProject = await response.json()
      console.log("Client: Sample project created:", newProject)

      // Tải lại danh sách dự án
      fetchProjects()
    } catch (err) {
      console.error("Client: Error creating sample project:", err)
      setError(`Lỗi khi tạo dự án mẫu: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsCreatingSample(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center flex-1 gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm dự án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="preparing">Đang chuẩn bị</SelectItem>
            <SelectItem value="in_progress">Đang thi công</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="on_hold">Tạm dừng</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </Select>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Đang tải dự án...</span>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi khi tải dự án</AlertTitle>
            <AlertDescription>
              {error}
              <div className="flex gap-2 mt-2">
                <Button onClick={fetchProjects} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
                <Button onClick={createSampleProject} variant="outline" size="sm" disabled={isCreatingSample}>
                  {isCreatingSample ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tạo dự án mẫu
                    </>
                  )}
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {debugInfo && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">Thông tin debug</h3>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Thời gian:</strong> {new Date(debugInfo.timestamp).toLocaleString()}
                  </p>
                  <p>
                    <strong>Môi trường:</strong> {debugInfo.environment}
                  </p>

                  <div className="mt-2">
                    <p className="font-semibold">Database:</p>
                    <p>
                      <strong>URL:</strong> {debugInfo.database.url}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      {debugInfo.database.status === "connected" ? "Đã kết nối" : "Lỗi kết nối"}
                    </p>
                    {debugInfo.database.error && (
                      <p>
                        <strong>Lỗi:</strong> {debugInfo.database.error}
                      </p>
                    )}
                    {debugInfo.database.tables && (
                      <p>
                        <strong>Số bảng:</strong> {debugInfo.database.tables.length}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="font-semibold">Schema:</p>
                    <p>
                      <strong>Trạng thái:</strong> {debugInfo.schema.status === "valid" ? "Hợp lệ" : "Lỗi"}
                    </p>
                    {debugInfo.schema.error && (
                      <p>
                        <strong>Lỗi:</strong> {debugInfo.schema.error}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="font-semibold">Tạo dự án:</p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      {debugInfo.projectCreation.status === "success" ? "Thành công" : "Lỗi"}
                    </p>
                    {debugInfo.projectCreation.error && (
                      <p>
                        <strong>Lỗi:</strong> {debugInfo.projectCreation.error}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Không tìm thấy dự án nào phù hợp với bộ lọc"
                  : "Chưa có dự án nào. Hãy tạo dự án đầu tiên!"}
              </p>
              <Button onClick={createSampleProject} disabled={isCreatingSample}>
                {isCreatingSample ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo dự án mẫu...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tạo dự án mẫu
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}
