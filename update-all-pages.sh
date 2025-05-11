#!/bin/bash
# Script để cập nhật tất cả các page sử dụng Supabase

echo "Tìm tất cả các page sử dụng Supabase..."
PAGES=$(find app -type f -name "*.tsx" -o -name "*.ts" | grep -v "api" | xargs grep -l "supabase")

echo "Cập nhật các page..."
for page in $PAGES; do
  echo "Cập nhật: $page"
  
  # Thay thế import createClient từ @supabase/supabase-js bằng import từ lib/supabase/client
  sed -i 's/import { createClient } from "@supabase\/supabase-js"/import { supabase, isSupabaseReady } from "@\/lib\/supabase\/client"/g' "$page"
  
  # Thay thế import createClient từ lib/supabase
  sed -i 's/import { createClient } from "@\/lib\/supabase"/import { supabase, isSupabaseReady } from "@\/lib\/supabase\/client"/g' "$page"
  
  # Thay thế createClient() bằng supabase
  sed -i 's/const supabase = createClient(/\/\/ const supabase = createClient(/g' "$page"
  
  # Thêm kiểm tra isSupabaseReady() vào đầu các hàm async
  sed -i '/export default async function/a\  // Kiểm tra xem Supabase có sẵn sàng không\n  if (!isSupabaseReady()) {\n    return (\n      <div className="container mx-auto p-4">\n        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">\n          <p className="font-bold">Cảnh báo</p>\n          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>\n        </div>\n      </div>\n    )\n  }' "$page"
done

echo "Hoàn thành!"
