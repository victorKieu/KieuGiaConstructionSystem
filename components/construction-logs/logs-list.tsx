"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Edit, Eye, Plus, Search, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "@/components/ui/use-toast"
import { MediaGallery } from "./media-gallery"
import { MediaUploader } from "./media-uploader"

type Project = {
  id: number
  name: string
  code: string
}

type ConstructionLog = {
  id: number
  projectId: number
  project: {
    id: number
    name: string
    code: string
  }
  date: string
  weather: string
  temperature: string
  workPerformed: string
  issues: string
  createdBy: {
    id: number
    name: string
  }
  media: {
    id: number
    type: string
    url: string
  }[]
  createdAt: string
}

export function LogsList() {
  const [isAddingLog, setIsAddingLog] = useState(false)
  const [isViewingLog, setIsViewingLog] = useState(false)
  const [isEditingLog, setIsEditingLog] = useState(false)
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const [logDate, setLogDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [logs, setLogs] = useState<ConstructionLog[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<ConstructionLog | null>(null)
  const [formData, setFormData] = useState({
    projectId: "",
    date: "",
    weather: "",
    temperature: "",
    workPerformed: "",
    issues: "",
  })

  useEffect(() => {
    fetchLogs()
    fetchProjects()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/construction-logs")
      const data = await response.json()

      if (data.data) {
        setLogs(data.data)
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhật ký",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const data = await response.json()

      if (data.data) {
        setProjects(data.data)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setLogDate(date)
    if (date) {
      setFormData((prev) => ({ ...prev, date: date.toISOString() }))
    }
  }

  const resetForm = () => {
    setFormData({
      projectId: "",
      date: "",
      weather: "",
      temperature: "",
      workPerformed: "",
      issues: "",
    })
    setLogDate(undefined)
  }

  const handleAddLog = async () => {
    try {
      if (!formData.projectId || !formData.date || !formData.workPerformed) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng điền đầy đủ thông tin bắt buộc",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/construction-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create log")
      }

      const data = await response.json()

      toast({
        title: "Thành công",
        description: "Đã tạo nhật ký mới",
      })

      fetchLogs()
      resetForm()
      setIsAddingLog(false)
    } catch (error) {
      console.error("Error adding log:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo nhật ký mới",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLog = async () => {
    try {
      if (!selectedLog || !formData.date || !formData.workPerformed) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng điền đầy đủ thông tin bắt buộc",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/construction-logs/${selectedLog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update log")
      }

      toast({
        title: "Thành công",
        description: "Đã cập nhật nhật ký",
      })

      fetchLogs()
      resetForm()
      setIsEditingLog(false)
      setSelectedLog(null)
    } catch (error) {
      console.error("Error updating log:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật nhật ký",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLog = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhật ký này?")) {
      return
    }

    try {
      const response = await fetch(`/api/construction-logs/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete log")
      }

      toast({
        title: "Thành công",
        description: "Đã xóa nhật ký",
      })

      fetchLogs()
    } catch (error) {
      console.error("Error deleting log:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa nhật ký",
        variant: "destructive",
      })
    }
  }

  const viewLog = (log: ConstructionLog) => {
    setSelectedLog(log)
    setIsViewingLog(true)
  }

  const editLog = (log: ConstructionLog) => {
    setSelectedLog(log)
    setFormData({
      projectId: log.projectId.toString(),
      date: log.date,
      weather: log.weather || "",
      temperature: log.temperature || "",
      workPerformed: log.workPerformed,
      issues: log.issues || "",
    })
    setLogDate(new Date(log.date))
    setIsEditingLog(true)
  }

  const uploadMedia = (log: ConstructionLog) => {
    setSelectedLog(log)
    setIsUploadingMedia(true)
  }

  // Lọc nhật ký theo từ khóa tìm kiếm
  const filteredLogs = logs.filter(
    (log) =>
      log.project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.workPerformed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="table-container">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Danh sách nhật ký công trình</CardTitle>
          <CardDescription>Quản lý nhật ký tiến độ các công trình</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm nhật ký..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddingLog} onOpenChange={setIsAddingLog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhật ký
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Thêm nhật ký mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho nhật ký công trình</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project" className="text-right">
                    Dự án
                  </Label>
                  <Select value={formData.projectId} onValueChange={(value) => handleSelectChange("projectId", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn dự án" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name} ({project.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logDate" className="text-right">
                    Ngày
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !logDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {logDate ? format(logDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={logDate} onSelect={handleDateChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weather" className="text-right">
                    Thời tiết
                  </Label>
                  <Input
                    id="weather"
                    name="weather"
                    placeholder="Nhập thời tiết"
                    className="col-span-3"
                    value={formData.weather}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="temperature" className="text-right">
                    Nhiệt độ
                  </Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    placeholder="Nhập nhiệt độ"
                    className="col-span-3"
                    value={formData.temperature}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workPerformed" className="text-right">
                    Công việc đã thực hiện
                  </Label>
                  <Textarea
                    id="workPerformed"
                    name="workPerformed"
                    placeholder="Nhập công việc đã thực hiện"
                    className="col-span-3"
                    value={formData.workPerformed}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="issues" className="text-right">
                    Vấn đề gặp phải
                  </Label>
                  <Textarea
                    id="issues"
                    name="issues"
                    placeholder="Nhập vấn đề gặp phải (nếu có)"
                    className="col-span-3"
                    value={formData.issues}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingLog(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddLog}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dự án</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời tiết</TableHead>
                <TableHead>Công việc đã thực hiện</TableHead>
                <TableHead>Vấn đề gặp phải</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Media</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500">Không có nhật ký nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.project.name}</TableCell>
                    <TableCell>{new Date(log.date).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                      {log.weather && log.temperature ? `${log.weather}, ${log.temperature}` : log.weather || "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={log.workPerformed}>
                        {log.workPerformed}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={log.issues}>
                        {log.issues || "Không có"}
                      </div>
                    </TableCell>
                    <TableCell>{log.createdBy.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm">{log.media?.length || 0} tệp</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => viewLog(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => editLog(log)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteLog(log.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Dialog xem chi tiết nhật ký */}
        <Dialog open={isViewingLog} onOpenChange={setIsViewingLog}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Chi tiết nhật ký</DialogTitle>
              <DialogDescription>
                {selectedLog &&
                  `Dự án: ${selectedLog.project.name} - Ngày: ${new Date(selectedLog.date).toLocaleDateString("vi-VN")}`}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Thời tiết</Label>
                    <p className="mt-1">{selectedLog.weather || "N/A"}</p>
                  </div>
                  <div>
                    <Label>Nhiệt độ</Label>
                    <p className="mt-1">{selectedLog.temperature || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <Label>Công việc đã thực hiện</Label>
                  <p className="mt-1 whitespace-pre-line">{selectedLog.workPerformed}</p>
                </div>

                <div>
                  <Label>Vấn đề gặp phải</Label>
                  <p className="mt-1 whitespace-pre-line">{selectedLog.issues || "Không có"}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Hình ảnh & Video</Label>
                    <Button size="sm" onClick={() => uploadMedia(selectedLog)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Thêm media
                    </Button>
                  </div>
                  <div className="mt-2">
                    <MediaGallery logId={selectedLog.id} onDeleteComplete={() => fetchLogs()} />
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Người tạo: {selectedLog.createdBy.name} - Ngày tạo:{" "}
                  {new Date(selectedLog.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog chỉnh sửa nhật ký */}
        <Dialog open={isEditingLog} onOpenChange={setIsEditingLog}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa nhật ký</DialogTitle>
              <DialogDescription>Cập nhật thông tin nhật ký công trình</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="project" className="text-right">
                  Dự án
                </Label>
                <Input id="project" value={selectedLog?.project.name} className="col-span-3" disabled />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logDate" className="text-right">
                  Ngày
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !logDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {logDate ? format(logDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={logDate} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weather" className="text-right">
                  Thời tiết
                </Label>
                <Input
                  id="weather"
                  name="weather"
                  placeholder="Nhập thời tiết"
                  className="col-span-3"
                  value={formData.weather}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temperature" className="text-right">
                  Nhiệt độ
                </Label>
                <Input
                  id="temperature"
                  name="temperature"
                  placeholder="Nhập nhiệt độ"
                  className="col-span-3"
                  value={formData.temperature}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="workPerformed" className="text-right">
                  Công việc đã thực hiện
                </Label>
                <Textarea
                  id="workPerformed"
                  name="workPerformed"
                  placeholder="Nhập công việc đã thực hiện"
                  className="col-span-3"
                  value={formData.workPerformed}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issues" className="text-right">
                  Vấn đề gặp phải
                </Label>
                <Textarea
                  id="issues"
                  name="issues"
                  placeholder="Nhập vấn đề gặp phải (nếu có)"
                  className="col-span-3"
                  value={formData.issues}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditingLog(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateLog}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog upload media */}
        <Dialog open={isUploadingMedia} onOpenChange={setIsUploadingMedia}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Tải lên hình ảnh/video</DialogTitle>
              <DialogDescription>
                {selectedLog &&
                  `Dự án: ${selectedLog.project.name} - Ngày: ${new Date(selectedLog.date).toLocaleDateString("vi-VN")}`}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-4">
                <MediaUploader
                  logId={selectedLog.id}
                  onUploadComplete={() => {
                    fetchLogs()
                  }}
                />
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsUploadingMedia(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
