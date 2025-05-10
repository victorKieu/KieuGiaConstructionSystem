#!/bin/bash

# Tìm tất cả các file TypeScript và JavaScript trong dự án
find . -type f $$ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" $$ -not -path "./node_modules/*" | while read -r file; do
  # Kiểm tra xem file có sử dụng isSupabaseReady không
  if grep -q "isSupabaseReady" "$file"; then
    echo "Updating $file"
    # Thay thế import từ @/lib/supabase/client
    sed -i 's/import { isSupabaseReady } from "@\/lib\/supabase\/client"/import { isSupabaseReady } from "@\/lib\/supabase\/client"/g' "$file"
  fi
done

# Tìm tất cả các file TypeScript và JavaScript trong dự án
find . -type f $$ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" $$ -not -path "./node_modules/*" | while read -r file; do
  # Kiểm tra xem file có sử dụng createClient từ @/lib/supabase/server không
  if grep -q "import { createClient } from \"@/lib/supabase/server\"" "$file"; then
    echo "Updating $file"
    # Không cần thay thế vì chúng ta đã thêm lại createClient trong lib/supabase/server.ts
  fi
done

echo "Update completed"
