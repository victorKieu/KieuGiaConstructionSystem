#!/bin/bash
# Script để sửa lỗi trong app/dashboard/page.tsx

echo "Sửa lỗi trong app/dashboard/page.tsx..."

# Tạo thư mục nếu cần
mkdir -p "app/dashboard"

# Tạo nội dung mới cho app/dashboard/page.tsx
cat > "app/dashboard/page.tsx" << 'EOF'
import { isSupabaseReady } from "@/lib/supabase/client"

export default function DashboardPage() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (typeof window === "undefined" && !isSupabaseReady()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Cảnh báo</p>
          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* Nội dung dashboard */}
    </div>
  )
}
EOF

echo "Hoàn thành!"
