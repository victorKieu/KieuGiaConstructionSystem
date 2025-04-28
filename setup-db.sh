#!/bin/bash

# Hiển thị thông tin
echo "=== Kiểm tra và khởi tạo cơ sở dữ liệu ==="
echo "Đang kiểm tra biến môi trường DATABASE_URL..."

# Kiểm tra biến môi trường DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "Lỗi: Biến môi trường DATABASE_URL chưa được cấu hình."
  echo "Vui lòng thêm biến DATABASE_URL vào file .env"
  exit 1
else
  echo "Đã tìm thấy biến môi trường DATABASE_URL."
fi

# Tạo file .env nếu chưa tồn tại
if [ ! -f .env ]; then
  echo "Tạo file .env..."
  echo "DATABASE_URL=$DATABASE_URL" > .env
  echo "Đã tạo file .env với DATABASE_URL."
fi

# Kiểm tra và cài đặt Prisma CLI nếu cần
if ! command -v npx prisma &> /dev/null; then
  echo "Cài đặt Prisma CLI..."
  npm install -D prisma
fi

# Tạo schema Prisma nếu chưa tồn tại
if [ ! -d prisma ]; then
  echo "Khởi tạo Prisma schema..."
  npx prisma init
fi

# Generate Prisma client
echo "Tạo Prisma client..."
npx prisma generate

# Kiểm tra kết nối đến cơ sở dữ liệu
echo "Kiểm tra kết nối đến cơ sở dữ liệu..."
npx prisma db pull

if [ $? -eq 0 ]; then
  echo "Kết nối thành công đến cơ sở dữ liệu."
else
  echo "Lỗi kết nối đến cơ sở dữ liệu. Vui lòng kiểm tra lại DATABASE_URL."
  exit 1
fi

# Áp dụng migration
echo "Áp dụng migration..."
npx prisma migrate dev --name init

echo "=== Hoàn tất khởi tạo cơ sở dữ liệu ==="
