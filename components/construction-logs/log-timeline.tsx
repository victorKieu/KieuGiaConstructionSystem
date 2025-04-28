"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, FileText, ImageIcon, Video } from "lucide-react"

export function LogTimeline() {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const timelineEvents = [
    {
      id: 1,
      projectName: "Chung cư ABC",
      date: "2023-01-15",
      title: "Khởi công dự án",
      description: "Lễ khởi công dự án Chung cư ABC",
      media: [
        { type: "image", url: "/city-construction-skyline.png" },
        { type: "image", url: "/groundbreaking-event.png" },
      ],
      documents: [{ name: "Biên bản khởi công.pdf", size: "2.5MB" }],
      createdBy: "Nguyễn Văn A",
    },
    {
      id: 2,
      projectName: "Chung cư ABC",
      date: "2023-01-20",
      title: "Đào móng",
      description: "Bắt đầu công tác đào móng và chuẩn bị cốt thép móng",
      media: [
        { type: "image", url: "/construction-site-foundation.png" },
        { type: "video", url: "/construction-site-overview.png" },
      ],
      documents: [],
      createdBy: "Nguyễn Văn A",
    },
    {
      id: 3,
      projectName: "Biệt thự XYZ",
      date: "2023-02-05",
      title: "Đổ bê tông móng",
      description: "Hoàn thành đổ bê tông móng cho dự án",
      media: [
        { type: "image", url: "/construction-site-pour.png" },
        { type: "image", url: "/placeholder.svg?height=200&width=300&query=foundation+concrete" },
      ],
      documents: [{ name: "Báo cáo kiểm tra bê tông.pdf", size: "1.8MB" }],
      createdBy: "Trần Thị B",
    },
    {
      id: 4,
      projectName: "Biệt thự XYZ",
      date: "2023-02-20",
      title: "Thi công cột tầng 1",
      description: "Bắt đầu thi công cột tầng 1 của dự án",
      media: [{ type: "image", url: "/placeholder.svg?height=200&width=300&query=column+construction" }],
      documents: [],
      createdBy: "Trần Thị B",
    },
    {
      id: 5,
      projectName: "Nhà máy DEF",
      date: "2023-03-10",
      title: "Chuẩn bị mặt bằng",
      description: "Chuẩn bị mặt bằng và rào chắn công trường",
      media: [{ type: "image", url: "/placeholder.svg?height=200&width=300&query=construction+site+preparation" }],
      documents: [{ name: "Kế hoạch thi công.pdf", size: "3.2MB" }],
      createdBy: "Lê Văn C",
    },
  ]

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dòng thời gian công trình</CardTitle>
        <CardDescription>Xem tiến độ công trình theo dòng thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:ml-0.5 before:h-full before:w-0.5 before:bg-gray-200">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1">
                      {event.projectName}
                    </Badge>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                  </div>
                  <div className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString("vi-VN")}</div>
                </div>
                <p className="mb-4 text-gray-600">{event.description}</p>

                {event.media.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">Hình ảnh & Video</h4>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                      {event.media.map((media, mediaIndex) => (
                        <div key={mediaIndex} className="relative aspect-video overflow-hidden rounded-md">
                          <img
                            src={media.url || "/placeholder.svg"}
                            alt={`Media ${mediaIndex + 1} for ${event.title}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 rounded-full bg-black/70 p-1 text-white">
                            {getMediaIcon(media.type)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.documents.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium">Tài liệu</h4>
                    <div className="space-y-2">
                      {event.documents.map((doc, docIndex) => (
                        <div key={docIndex} className="flex items-center rounded-md border p-2">
                          <FileText className="mr-2 h-4 w-4 text-blue-600" />
                          <span className="flex-1">{doc.name}</span>
                          <span className="text-xs text-gray-500">{doc.size}</span>
                          <Button variant="ghost" size="sm" className="ml-2">
                            Tải xuống
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-right text-xs text-gray-500">Người tạo: {event.createdBy}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
