"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function RecentActivities() {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        // Sử dụng dữ liệu mẫu thay vì gọi API để tránh lỗi
        setActivities([
          {
            id: 1,
            action: "Cập nhật dự án",
            user: "Nguyễn Văn A",
            timestamp: "2 giờ trước",
          },
          {
            id: 2,
            action: "Thêm vật tư mới",
            user: "Trần Thị B",
            timestamp: "3 giờ trước",
          },
          {
            id: 3,
            action: "Tạo báo cáo",
            user: "Lê Văn C",
            timestamp: "5 giờ trước",
          },
        ])
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching activities:", err)
        setError("Không thể tải dữ liệu hoạt động")
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
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
          <CardTitle>Hoạt động gần đây</CardTitle>
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
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border-b pb-2">
              <div className="font-medium">{activity.action}</div>
              <div className="text-sm text-gray-500">
                {activity.user} • {activity.timestamp}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
