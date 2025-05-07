import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    data: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0901234567",
      },
      {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@example.com",
        phone: "0901234568",
      },
    ],
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({
      status: "success",
      message: "Đã nhận thông tin liên hệ",
      data: body,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Lỗi khi xử lý yêu cầu",
      },
      { status: 400 },
    )
  }
}
