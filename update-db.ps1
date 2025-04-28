Write-Host "Đang cập nhật database schema..." -ForegroundColor Cyan

# Kiểm tra xem npx có tồn tại không
$npxExists = Get-Command npx -ErrorAction SilentlyContinue
if (-not $npxExists) {
    Write-Host "Không tìm thấy lệnh npx. Hãy đảm bảo Node.js đã được cài đặt đúng cách." -ForegroundColor Red
    exit 1
}

# Đẩy schema lên database
Write-Host "Đang đẩy schema lên database..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi đẩy schema lên database." -ForegroundColor Red
    exit 1
}

# Tạo lại Prisma client
Write-Host "Đang tạo lại Prisma client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "Lỗi khi tạo lại Prisma client." -ForegroundColor Red
    exit 1
}

# Xóa thư mục .next
Write-Host "Đang xóa thư mục .next..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
}

Write-Host "Cập nhật database thành công!" -ForegroundColor Green
Write-Host "Hãy khởi động lại server bằng lệnh: npm run dev" -ForegroundColor Cyan
