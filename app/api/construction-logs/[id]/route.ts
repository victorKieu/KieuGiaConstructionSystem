import { type NextRequest, NextResponse } from "next/server"

// Dữ liệu mẫu (tham chiếu từ route.ts)
const sampleLogs = [
  {
    id: 1,
    projectId: 1,
    project: {
      id: 1,
      name: "Chung cư ABC",
      code: "PRJ001",
    },
    date: "2023-01-15",
    weather: "Nắng nhẹ",
    temperature: "28°C",
    workPerformed: "Khảo sát địa chất và chuẩn bị mặt bằng",
    issues: "Không có",
    createdBy: {
      id: 1,
      name: "Nguyễn Văn A",
    },
    media: [
      { id: 1, type: "IMAGE", url: "/city-construction-skyline.png" },
      { id: 2, type: "IMAGE", url: "/busy-city-construction.png" },
    ],
    createdAt: "2023-01-15T08:00:00Z",
  },
  {
    id: 2,
    projectId: 1,
    project: {
      id: 1,
      name: "Chung cư ABC",
      code: "PRJ001",
    },
    date: "2023-01-20",
    weather: "Nắng",
    temperature: "30°C",
    workPerformed: "Đào móng và chuẩn bị cốt thép móng",
    issues: "Gặp một số khó khăn khi đào do đất cứng",
    createdBy: {
      id: 1,
      name: "Nguyễn Văn A",
    },
    media: [
      { id: 3, type: "IMAGE", url: "/construction-site-foundation.png" },
      { id: 4, type: "VIDEO", url: "/construction-site-overview.png" },
    ],
    createdAt: "2023-01-20T08:00:00Z",
  },
  {
    id: 3,
    projectId: 2,
    project: {
      id: 2,
      name: "Biệt thự XYZ",
      code: "PRJ002",
    },
    date: "2023-02-05",
    weather: "Mưa nhẹ",
    temperature: "25°C",
    workPerformed: "Đổ bê tông móng",
    issues: "Trì hoãn do mưa buổi sáng",
    createdBy: {
      id: 2,
      name: "Trần Thị B",
    },
    media: [{ id: 5, type: "IMAGE", url: "/construction-site-pour.png" }],
    createdAt: "2023-02-05T08:00:00Z",
  },
]

// GET: Lấy chi tiết nhật ký công trình
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const log = sampleLogs.find((log) => log.id === id)

    if (!log) {
      return NextResponse.json({ error: "Construction log not found" }, { status: 404 })
    }

    return NextResponse.json({ data: log })
  } catch (error) {
    console.error("Error fetching construction log:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// PUT: Cập nhật nhật ký công trình
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { date, weather, temperature, workPerformed, issues } = body

    // Validate input
    if (!date || !workPerformed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Tìm nhật ký cần cập nhật
    const logIndex = sampleLogs.findIndex((log) => log.id === id)
    if (logIndex === -1) {
      return NextResponse.json({ error: "Construction log not found" }, { status: 404 })
    }

    // Cập nhật nhật ký
    const updatedLog = {
      ...sampleLogs[logIndex],
      date,
      weather,
      temperature,
      workPerformed,
      issues,
    }

    // Trong thực tế, sẽ cập nhật vào database
    // Ở đây chỉ mô phỏng
    sampleLogs[logIndex] = updatedLog

    return NextResponse.json({ data: updatedLog })
  } catch (error) {
    console.error("Error updating construction log:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE: Xóa nhật ký công trình
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Tìm nhật ký cần xóa
    const logIndex = sampleLogs.findIndex((log) => log.id === id)
    if (logIndex === -1) {
      return NextResponse.json({ error: "Construction log not found" }, { status: 404 })
    }

    // Trong thực tế, sẽ xóa từ database
    // Ở đây chỉ mô phỏng
    sampleLogs.splice(logIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting construction log:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
