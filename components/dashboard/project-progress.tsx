"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

export function ProjectProgress() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        // Sử dụng dữ liệu mẫu thay vì gọi API để tránh lỗi
        setProjects([
          { id: 1, name: "Dự án A", progress: 75 },
          { id: 2, name: "Dự án B", progress: 45 },
          { id: 3, name: "Dự án C", progress: 90 },
        ])
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching projects:", err)
        setError("Không thể tải dữ liệu dự án")
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ dự án</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ dự án</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiến độ dự án</CardTitle>
        <CardDescription>Theo dõi tiến độ các dự án đang thực hiện</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-gray-500">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
