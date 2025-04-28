#!/bin/bash

# Cập nhật các gói phụ thuộc
echo "Cập nhật các gói phụ thuộc..."
npm install

# Kiểm tra và tạo cơ sở dữ liệu
echo "Kiểm tra và tạo cơ sở dữ liệu..."
npx prisma migrate dev

# Khởi động ứng dụng trong chế độ phát triển
echo "Khởi động ứng dụng trong chế độ phát triển..."
npm run dev
