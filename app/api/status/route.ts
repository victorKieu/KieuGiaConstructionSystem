import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "API đang hoạt động bình thường.",
    timestamp: new Date().toISOString(),
  })
}

export async function POST() {
  return NextResponse.json({
    status: "success",
    message: "API đang hoạt động bình thường.",
    timestamp: new Date().toISOString(),
  })
}

export async function PUT() {
  return NextResponse.json({
    status: "success",
    message: "API đang hoạt động bình thường.",
    timestamp: new Date().toISOString(),
  })
}

export async function DELETE() {
  return NextResponse.json({
    status: "success",
    message: "API đang hoạt động bình thường.",
    timestamp: new Date().toISOString(),
  })
}

export async function PATCH() {
  return NextResponse.json({
    status: "success",
    message: "API đang hoạt động bình thường.",
    timestamp: new Date().toISOString(),
  })
}
