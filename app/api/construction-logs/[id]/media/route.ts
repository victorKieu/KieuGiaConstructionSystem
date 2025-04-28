import { type NextRequest, NextResponse } from "next/server"

// Dữ liệu mẫu cho media
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

// POST: Upload media cho nhật ký công trình
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const logId = Number.parseInt(params.id)

    // Trong thực tế, sẽ xử lý file upload
    // Ở đây chỉ mô phỏng
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Mô phỏng upload file
    const fileType = file.type.startsWith("image/") ? "IMAGE" : "VIDEO"
    const newMedia = {
      id: sampleMedia.length + 1,
      constructionLogId: logId,
      type: fileType,
      url: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(file.name)}`,
      filename: file.name,
      size: file.size,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    }

    // Trong thực tế, sẽ lưu vào database
    // Ở đây chỉ mô phỏng
    sampleMedia.push(newMedia)

    return NextResponse.json({ data: newMedia }, { status: 201 })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// GET: Lấy danh sách media của nhật ký công trình
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const logId = Number.parseInt(params.id)
    const media = sampleMedia.filter((item) => item.constructionLogId === logId)

    return NextResponse.json({ data: media })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
