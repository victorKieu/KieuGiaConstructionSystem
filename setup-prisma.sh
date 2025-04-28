#!/bin/bash

echo "Cài đặt dependencies..."
npm install

echo "Tạo Prisma client..."
npx prisma generate

echo "Hoàn tất! Prisma client đã được tạo."
