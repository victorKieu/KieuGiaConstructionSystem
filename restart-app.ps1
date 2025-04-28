Write-Host "Đang khởi động lại ứng dụng..." -ForegroundColor Green

# Xóa thư mục .next để đảm bảo build mới
if (Test-Path -Path ".next") {
    Write-Host "Đang xóa thư mục .next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# Xóa thư mục node_modules/.cache để xóa cache
if (Test-Path -Path "node_modules/.cache") {
    Write-Host "Đang xóa cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules/.cache
}

# Khởi động lại ứng dụng
Write-Host "Đang khởi động lại ứng dụng..." -ForegroundColor Green
npm run dev
