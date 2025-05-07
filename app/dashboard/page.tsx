"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Package, Users, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Đánh dấu component đã load xong để tránh hydration mismatch
    setIsLoaded(true)
  }, [])

  // Nếu đang ở client-side nhưng chưa load xong, hiển thị skeleton
  if (!isLoaded) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động của công ty</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số dự án</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 đang thực hiện, 7 đã hoàn thành</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vật tư tồn kho</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">15 vật tư sắp hết hàng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">Tổng số khách hàng đã đăng ký</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động gần đây</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Hoạt động trong 24 giờ qua</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tiến độ dự án</CardTitle>
            <CardDescription>Theo dõi tiến độ các dự án đang thực hiện</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "Chung cư Kiều Gia", progress: 75 },
                { name: "Nhà phố Thủ Đức", progress: 45 },
                { name: "Biệt thự Quận 9", progress: 90 },
                { name: "Văn phòng Quận 1", progress: 30 },
              ].map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{project.name}</p>
                    </div>
                    <p className="text-sm font-medium">{project.progress}%</p>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Vật tư sắp hết hàng</CardTitle>
            <CardDescription>Danh sách vật tư cần nhập thêm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Xi măng Portland", quantity: 15, unit: "bao" },
                { name: "Thép xây dựng Φ10", quantity: 200, unit: "kg" },
                { name: "Gạch ốp tường 30x60", quantity: 50, unit: "m²" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">{item.name}</span>
                  <span>
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="px-6 pb-4">
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard/inventory">
                Xem tất cả vật tư
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                {
                  user: "Nguyễn Văn A",
                  action: "đã tạo dự án mới",
                  target: "Chung cư Kiều Gia",
                  time: "2 giờ trước",
                  userInitials: "NA",
                },
                {
                  user: "Trần Thị B",
                  action: "đã cập nhật tiến độ dự án",
                  target: "Nhà phố Thủ Đức",
                  time: "3 giờ trước",
                  userInitials: "TB",
                },
                {
                  user: "Lê Văn C",
                  action: "đã thêm vật tư mới",
                  target: "Xi măng Portland",
                  time: "5 giờ trước",
                  userInitials: "LC",
                },
                {
                  user: "Phạm Thị D",
                  action: "đã tạo yêu cầu mua hàng",
                  target: "YC-2023-001",
                  time: "6 giờ trước",
                  userInitials: "PD",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">{activity.userInitials}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
