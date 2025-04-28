# Script để khởi động ứng dụng Kieu Gia Construction

Write-Host "Bắt đầu khởi động ứng dụng..." -ForegroundColor Green

# Kiểm tra và thiết lập cơ sở dữ liệu
if (Test-Path "setup-db.ps1") {
    Write-Host "Thiết lập cơ sở dữ liệu..." -ForegroundColor Yellow
    .\setup-db.ps1
} else {
    Write-Host "Không tìm thấy script thiết lập cơ sở dữ liệu." -ForegroundColor Yellow
}

# Khởi động ứng dụng
Write-Host "Khởi động ứng dụng..." -ForegroundColor Green
npm run dev
