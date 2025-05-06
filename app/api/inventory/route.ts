import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function POST() {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function PUT() {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}

export async function DELETE() {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}
