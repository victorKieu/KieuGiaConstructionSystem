import { type NextRequest, NextResponse } from "next/server"

// Dữ liệu mẫu cho media (tham chiếu từ route.ts)
const sampleMedia = [
  {
    id: 1,
    constructionLogId: 1,
    type: "IMAGE",
    url: "/city-construction-skyline.png",
    filename: "site-overview.jpg",
    size: 1024000,
    mimeType: "image/jpeg",
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: 2,
    constructionLogId: 1,
    type: "IMAGE",
    url: "/busy-city-construction.png",
    filename: "workers.jpg",
    size: 1536000,
    mimeType: "image/jpeg",
    createdAt: "2023-01-15T08:35:00Z",
  },
  {
    id: 3,
    constructionLogId: 2,
    type: "IMAGE",
    url: "/construction-site-foundation.png",
    filename: "foundation.jpg",
    size: 2048000,
    mimeType: "image/jpeg",
    createdAt: "2023-01-20T09:00:00Z",
  },
  {
    id: 4,
    constructionLogId: 2,
    type: "VIDEO",
    url: "/construction-site-overview.png",
    filename: "site-tour.mp4",
    size: 10240000,
    mimeType: "video/mp4",
    createdAt: "2023-01-20T09:15:00Z",
  },
  {
    id: 5,
    constructionLogId: 3,
    type: "IMAGE",
    url: "/construction-site-pour.png",
    filename: "concrete-work.jpg",
    size: 1843000,
    mimeType: "image/jpeg",
    createdAt: "2023-02-05T10:00:00Z",
  },
]

// DELETE: Xóa media của nhật ký công trình
export async function DELETE(request: NextRequest, { params }: { params: { id: string; mediaId: string } }) {
  try {
    const logId = Number.parseInt(params.id)
    const mediaId = Number.parseInt(params.mediaId)

    // Tìm media cần xóa
    const mediaIndex = sampleMedia.findIndex((media) => media.id === mediaId && media.constructionLogId === logId)
    if (mediaIndex === -1) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Trong thực tế, sẽ xóa file từ storage và xóa record từ database
    // Ở đây chỉ mô phỏng
    sampleMedia.splice(mediaIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting media:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
