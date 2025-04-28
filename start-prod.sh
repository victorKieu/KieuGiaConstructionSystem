#!/bin/bash

# Cập nhật các gói phụ thuộc
echo "Cập nhật các gói phụ thuộc..."
npm install

# Xây dựng ứng dụng
echo "Xây dựng ứng dụng..."
npm run build

# Kiểm tra và tạo cơ sở dữ liệu
echo "Kiểm tra và tạo cơ sở dữ liệu..."
npx prisma migrate deploy

# Khởi động ứng dụng trong chế độ sản xuất
echo "Khởi động ứng dụng trong chế độ sản xuất..."
npm run start
