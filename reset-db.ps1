# Script để khởi tạo lại database

Write-Host "=== Khởi tạo lại database ===" -ForegroundColor Cyan

# Kiểm tra file .env
if (-not (Test-Path ".env")) {
    Write-Host "Không tìm thấy file .env!" -ForegroundColor Red
    
    # Tạo file .env
    @"
# Neon Database
DATABASE_URL="postgresql://neondb_owner:npg_cbyjBd0nvA9f@ep-long-fire-a4le6pq1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "Đã tạo file .env với DATABASE_URL." -ForegroundColor Green
} else {
    Write-Host "File .env đã tồn tại." -ForegroundColor Green
}

# Xóa Prisma client cũ
Write-Host "Xóa Prisma client cũ..." -ForegroundColor Yellow
if (Test-Path "node_modules/.prisma") {
    Remove-Item -Recurse -Force "node_modules/.prisma"
}
if (Test-Path "node_modules/@prisma") {
    Remove-Item -Recurse -Force "node_modules/@prisma"
}

# Tạo lại Prisma client
Write-Host "Tạo lại Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Đẩy schema lên database
Write-Host "Đẩy schema lên database..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

# Khởi động lại server
Write-Host "Khởi động lại server..." -ForegroundColor Green
npm run dev
