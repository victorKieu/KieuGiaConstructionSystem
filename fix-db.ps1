# Script để kiểm tra và sửa lỗi database

Write-Host "=== Kiểm tra và sửa lỗi database ===" -ForegroundColor Cyan

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
    
    # Kiểm tra DATABASE_URL trong file .env
    $envContent = Get-Content ".env" -Raw
    if (-not ($envContent -match "DATABASE_URL=")) {
        Write-Host "Không tìm thấy DATABASE_URL trong file .env!" -ForegroundColor Red
        
        # Thêm DATABASE_URL vào file .env
        @"

# Neon Database
DATABASE_URL="postgresql://neondb_owner:npg_cbyjBd0nvA9f@ep-long-fire-a4le6pq1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
"@ | Out-File -FilePath ".env" -Append -Encoding utf8
        
        Write-Host "Đã thêm DATABASE_URL vào file .env." -ForegroundColor Green
    } else {
        Write-Host "DATABASE_URL đã tồn tại trong file .env." -ForegroundColor Green
    }
}

# Tạo Prisma client
Write-Host "Tạo Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Đẩy schema lên database
Write-Host "Đẩy schema lên database..." -ForegroundColor Yellow
npx prisma db push

# Kiểm tra kết nối database
Write-Host "Kiểm tra kết nối database..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/db-check" -Method Get -ErrorAction SilentlyContinue

if ($response.status -eq "success") {
    Write-Host "Kết nối database thành công!" -ForegroundColor Green
} else {
    Write-Host "Lỗi kết nối database!" -ForegroundColor Red
    Write-Host "Chi tiết lỗi: $($response.error)" -ForegroundColor Red
}

Write-Host "=== Hoàn tất kiểm tra và sửa lỗi database ===" -ForegroundColor Cyan
