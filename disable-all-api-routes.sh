#!/bin/bash
# Script để vô hiệu hóa tất cả các API route

# Danh sách các API route cần giữ lại
KEEP_ROUTES=(
  "app/api/env-check/route.ts"
  "app/api/system-check/route.ts"
  "app/api/auth"
)

# Hàm kiểm tra xem một đường dẫn có nên được giữ lại không
should_keep() {
  local path="$1"
  for keep in "${KEEP_ROUTES[@]}"; do
    if [[ "$path" == "$keep" || "$path" == "$keep"* ]]; then
      return 0
    fi
  done
  return 1
}

# Tìm tất cả các API route
echo "Tìm tất cả các API route..."
API_ROUTES=$(find app/api -type f -name "*.ts" -o -name "*.js" | sort)

# Vô hiệu hóa các API route
echo "Vô hiệu hóa các API route..."
for route in $API_ROUTES; do
  if should_keep "$route"; then
    echo "Giữ lại: $route"
  else
    echo "Vô hiệu hóa: $route"
    
    # Tạo thư mục nếu cần
    mkdir -p "$(dirname "$route")"
    
    # Tạo nội dung mới cho API route
    cat > "$route" << 'EOF'
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

export async function PATCH() {
  return NextResponse.json({
    status: "maintenance",
    message: "API đang được bảo trì. Vui lòng thử lại sau.",
    timestamp: new Date().toISOString(),
  })
}
EOF
  fi
done

echo "Hoàn thành!"
