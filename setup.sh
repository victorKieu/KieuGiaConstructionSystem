#!/bin/bash

# Cài đặt dependencies
echo "Cài đặt dependencies..."
npm install

# Tạo Prisma client
echo "Tạo Prisma client..."
npx prisma generate

# Khởi tạo cơ sở dữ liệu (nếu cần)
echo "Bạn có muốn khởi tạo cơ sở dữ liệu? (y/n)"
read answer
if [ "$answer" = "y" ]; then
  echo "Khởi tạo cơ sở dữ liệu..."
  npx prisma migrate dev --name init
  
  echo "Tạo dữ liệu mẫu? (y/n)"
  read seed_answer
  if [ "$seed_answer" = "y" ]; then
    echo "Tạo dữ liệu mẫu..."
    npm run seed
  fi
fi

# Khởi động ứng dụng
echo "Khởi động ứng dụng..."
npm run dev
