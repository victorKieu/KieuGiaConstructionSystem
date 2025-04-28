# Script để khởi động lại server

Write-Host "=== Khởi động lại server ===" -ForegroundColor Cyan

# Kiểm tra và sửa lỗi database
Write-Host "Kiểm tra và sửa lỗi database..." -ForegroundColor Yellow
.\fix-db.ps1

# Tạo Prisma client
Write-Host "Tạo Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Khởi động lại server
Write-Host "Khởi động lại server..." -ForegroundColor Green
npm run dev
