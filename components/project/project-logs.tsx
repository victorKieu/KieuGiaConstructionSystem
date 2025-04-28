import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProjectLogsProps {
  projectId: string
}

export default function ProjectLogs({ projectId }: ProjectLogsProps) {
  // Trong thực tế, dữ liệu này sẽ được lấy từ API dựa trên projectId
  const logs = [
    {
      id: 1,
      date: "2023-01-15",
      title: "Khởi công dự án",
      description: "Lễ khởi công dự án đã diễn ra thành công với sự tham gia của các bên liên quan.",
      author: "Nguyễn Văn A",
      type: "milestone",
      media: ["/groundbreaking-event.png"],
    },
    {
      id: 2,
      date: "2023-01-20",
      title: "Hoàn thành san lấp mặt bằng",
      description: "Đã hoàn thành công tác san lấp mặt bằng, chuẩn bị cho việc đào móng.",
      author: "Trần Văn B",
      type: "progress",
      media: [],
    },
    {
      id: 3,
      date: "2023-02-05",
      title: "Hoàn thành đào móng",
      description: "Đã hoàn thành công tác đào móng theo đúng thiết kế.",
      author: "Lê Văn C",
      type: "progress",
      media: ["/construction-site-foundation.png"],
    },
    {
      id: 4,
      date: "2023-02-15",
      title: "Vấn đề với hệ thống thoát nước",
      description: "Phát hiện vấn đề với hệ thống thoát nước, cần điều chỉnh thiết kế.",
      author: "Phạm Văn D",
      type: "issue",
      media: [],
    },
    {
      id: 5,
      date: "2023-02-20",
      title: "Giải quyết vấn đề thoát nước",
      description: "Đã điều chỉnh thiết kế và giải quyết vấn đề với hệ thống thoát nước.",
      author: "Phạm Văn D",
      type: "resolution",
      media: [],
    },
  ]

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "milestone":
        return <Badge className="bg-blue-500">Cột mốc</Badge>
      case "progress":
        return <Badge className="bg-green-500">Tiến độ</Badge>
      case "issue":
        return <Badge variant="destructive">Vấn đề</Badge>
      case "resolution":
        return <Badge className="bg-yellow-500">Giải quyết</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
          <TabsTrigger value="gallery">Thư viện ảnh</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Nhật ký công trình</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {logs.map((log) => (
                  <div key={log.id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {log.id}
                      </div>
                      <div className="h-full w-0.5 bg-border"></div>
                    </div>
                    <div className="pb-8">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{log.title}</h3>
                        {getTypeBadge(log.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {log.date} - {log.author}
                      </p>
                      <p className="mt-2">{log.description}</p>
                      {log.media.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {log.media.map((media, index) => (
                            <div key={index} className="relative h-40 overflow-hidden rounded-md">
                              <Image
                                src={media || "/placeholder.svg"}
                                alt={`Media for ${log.title}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thư viện ảnh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {logs
                  .filter((log) => log.media.length > 0)
                  .flatMap((log) =>
                    log.media.map((media, mediaIndex) => (
                      <div
                        key={`${log.id}-${mediaIndex}`}
                        className="group relative aspect-square overflow-hidden rounded-md"
                      >
                        <Image
                          src={media || "/placeholder.svg"}
                          alt={`Media for ${log.title}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 p-4 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <h4 className="font-semibold">{log.title}</h4>
                          <p className="text-sm">{log.date}</p>
                        </div>
                      </div>
                    )),
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
