"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Download, FileText, ImageIcon, Trash, Video } from "lucide-react"
import Image from "next/image"

interface MediaGalleryProps {
  logId: number
  onDeleteComplete?: () => void
}

type MediaItem = {
  id: number
  type: string
  url: string
  filename: string
  size: number
  mimeType: string
  createdAt: string
}

export function MediaGallery({ logId, onDeleteComplete }: MediaGalleryProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [logId])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/construction-logs/${logId}/media`)
      const data = await response.json()

      if (data.data) {
        setMedia(data.data)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách media",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteMedia = async (mediaId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa media này?")) {
      return
    }

    try {
      const response = await fetch(`/api/construction-logs/${logId}/media/${mediaId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMedia((prev) => prev.filter((item) => item.id !== mediaId))
        toast({
          title: "Xóa thành công",
          description: "Đã xóa media",
        })
        if (onDeleteComplete) {
          onDeleteComplete()
        }
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa media",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredMedia = media.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "images") return item.type === "IMAGE"
    if (activeTab === "videos") return item.type === "VIDEO"
    return true
  })

  const isImage = (item: MediaItem) => item.type === "IMAGE"
  const isVideo = (item: MediaItem) => item.type === "VIDEO"

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Tất cả ({media.length})</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh ({media.filter((item) => item.type === "IMAGE").length})</TabsTrigger>
            <TabsTrigger value="videos">Video ({media.filter((item) => item.type === "VIDEO").length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-4">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>

        <TabsContent value="videos" className="mt-4">
          {renderMediaGrid(filteredMedia)}
        </TabsContent>
      </Tabs>

      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
          <DialogContent className="max-w-4xl">
            <div className="flex flex-col space-y-4">
              <div className="aspect-video relative rounded-md overflow-hidden bg-gray-100">
                {isImage(selectedMedia) ? (
                  <Image
                    src={selectedMedia.url || "/placeholder.svg"}
                    alt={selectedMedia.filename}
                    fill
                    className="object-contain"
                  />
                ) : isVideo(selectedMedia) ? (
                  <video src={selectedMedia.url} className="w-full h-full" controls autoPlay />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedMedia.filename}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedMedia.size)} • {new Date(selectedMedia.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" asChild>
                    <a href={selectedMedia.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Tải xuống
                    </a>
                  </Button>
                  <Button variant="destructive" onClick={() => deleteMedia(selectedMedia.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )

  function renderMediaGrid(items: MediaItem[]) {
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-lg">
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">Chưa có media nào</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setSelectedMedia(item)}
          >
            <CardContent className="p-2">
              <div className="aspect-video relative rounded-md overflow-hidden bg-gray-100">
                {isImage(item) ? (
                  <Image src={item.url || "/placeholder.svg"} alt={item.filename} fill className="object-cover" />
                ) : isVideo(item) ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <video src={item.url} className="max-h-full max-w-full" controls={false} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="mt-2">
                <p className="text-xs truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
