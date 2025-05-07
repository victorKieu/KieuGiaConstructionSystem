import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API đang hoạt động",
    timestamp: new Date().toISOString(),
  })
}

export async function POST() {
  return NextResponse.json({
    status: "ok",
    message: "API đang hoạt động",
    timestamp: new Date().toISOString(),
  })
}
