#!/bin/bash
# Script để cập nhật tất cả các API route

echo "Tìm tất cả các API route..."
API_ROUTES=$(find app/api -type f -name "*.ts" -o -name "*.js" | grep -v "env-check" | grep -v "system-check" | grep -v "maintenance")

echo "Cập nhật các API route..."
for route in $API_ROUTES; do
  echo "Cập nhật: $route"
  
  # Tạo nội dung mới cho API route
  cat > "$route" << 'EOF'
import { NextResponse } from "next/server"
import { supabase, isSupabaseReady } from "@/lib/supabase/client"

export async function GET() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return NextResponse.json({
      status: "error",
      message: "Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường.",
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }

  try {
    // Thực hiện logic của bạn ở đây
    return NextResponse.json({
      status: "success",
      message: "API đang hoạt động.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({
      status: "error",
      message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function POST() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return NextResponse.json({
      status: "error",
      message: "Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường.",
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }

  try {
    // Thực hiện logic của bạn ở đây
    return NextResponse.json({
      status: "success",
      message: "API đang hoạt động.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({
      status: "error",
      message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function PUT() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return NextResponse.json({
      status: "error",
      message: "Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường.",
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }

  try {
    // Thực hiện logic của bạn ở đây
    return NextResponse.json({
      status: "success",
      message: "API đang hoạt động.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({
      status: "error",
      message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function DELETE() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return NextResponse.json({
      status: "error",
      message: "Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường.",
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }

  try {
    // Thực hiện logic của bạn ở đây
    return NextResponse.json({
      status: "success",
      message: "API đang hoạt động.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({
      status: "error",
      message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function PATCH() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return NextResponse.json({
      status: "error",
      message: "Supabase chưa sẵn sàng. Vui lòng kiểm tra biến môi trường.",
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }

  try {
    // Thực hiện logic của bạn ở đây
    return NextResponse.json({
      status: "success",
      message: "API đang hoạt động.",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({
      status: "error",
      message: "Đã xảy ra lỗi khi xử lý yêu cầu.",
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
EOF
done

echo "Hoàn thành!"
