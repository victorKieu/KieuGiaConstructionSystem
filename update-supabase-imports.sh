#!/bin/bash

# Tìm tất cả các file sử dụng @supabase/auth-helpers-nextjs
echo "Tìm các file sử dụng @supabase/auth-helpers-nextjs..."
FILES=$(grep -r --include="*.ts" --include="*.tsx" "@supabase/auth-helpers-nextjs" . | cut -d: -f1 | sort | uniq)

if [ -z "$FILES" ]; then
  echo "Không tìm thấy file nào sử dụng @supabase/auth-helpers-nextjs."
  exit 0
fi

echo "Các file cần cập nhật:"
echo "$FILES"

# Cập nhật các import
for FILE in $FILES; do
  echo "Đang cập nhật $FILE..."
  
  # Thay thế createServerComponentClient bằng createServerClient từ @supabase/ssr
  sed -i 's/import { createServerComponentClient } from "@supabase\/auth-helpers-nextjs"/import { createServerClient } from "@supabase\/ssr"/g' $FILE
  sed -i "s/import { createServerComponentClient } from '@supabase\/auth-helpers-nextjs'/import { createServerClient } from '@supabase\/ssr'/g" $FILE
  
  # Thay thế createClientComponentClient bằng createBrowserClient từ @supabase/ssr
  sed -i 's/import { createClientComponentClient } from "@supabase\/auth-helpers-nextjs"/import { createBrowserClient } from "@supabase\/ssr"/g' $FILE
  sed -i "s/import { createClientComponentClient } from '@supabase\/auth-helpers-nextjs'/import { createBrowserClient } from '@supabase\/ssr'/g" $FILE
  
  # Thay thế createMiddlewareClient bằng createServerClient từ @supabase/ssr
  sed -i 's/import { createMiddlewareClient } from "@supabase\/auth-helpers-nextjs"/import { createServerClient } from "@supabase\/ssr"/g' $FILE
  sed -i "s/import { createMiddlewareClient } from '@supabase\/auth-helpers-nextjs'/import { createServerClient } from '@supabase\/ssr'/g" $FILE
  
  # Thay thế các hàm trong code
  sed -i 's/createServerComponentClient/createServerClient/g' $FILE
  sed -i 's/createClientComponentClient/createBrowserClient/g' $FILE
  sed -i 's/createMiddlewareClient/createServerClient/g' $FILE
done

echo "Hoàn tất cập nhật các import."
