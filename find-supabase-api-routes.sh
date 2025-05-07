#!/bin/bash
# Script để tìm tất cả các API route sử dụng Supabase

echo "Tìm tất cả các API route sử dụng Supabase..."
find app/api -type f -name "*.ts" -o -name "*.js" | xargs grep -l "supabase"

echo "Hoàn thành!"
