# Script để thiết lập database với Prisma

Write-Host "Bắt đầu thiết lập database với Prisma..." -ForegroundColor Green

# Kiểm tra xem đã cài đặt Prisma CLI chưa
$prismaCLI = npm list -g | Select-String "prisma"
if (-not $prismaCLI) {
    Write-Host "Đang cài đặt Prisma CLI..." -ForegroundColor Yellow
    npm install -g prisma
}

# Tạo migration
Write-Host "Đang tạo migration..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Tạo Prisma client
Write-Host "Đang tạo Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Thiết lập database hoàn tất!" -ForegroundColor Green
