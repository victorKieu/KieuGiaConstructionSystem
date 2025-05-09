import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Route handler để chặn các API route
export async function GET(request: Request) {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function PUT(request: Request) {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function DELETE(request: Request) {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function PATCH(request: Request) {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}
