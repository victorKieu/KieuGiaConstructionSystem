# Hiển thị banner
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  KHỞI TẠO CƠ SỞ DỮ LIỆU KIEU GIA  " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra file .env
if (-not (Test-Path -Path ".env")) {
    Write-Host "Không tìm thấy file .env. Đang tạo file..." -ForegroundColor Yellow
    
    # Hỏi người dùng về DATABASE_URL
    $databaseUrl = Read-Host "Nhập DATABASE_URL của Neon PostgreSQL"
    
    # Tạo file .env
    "DATABASE_URL=`"$databaseUrl`"" | Out-File -FilePath ".env" -Encoding utf8
    "NEXT_PUBLIC_APP_URL=`"http://localhost:3000`"" | Out-File -FilePath ".env" -Append -Encoding utf8
    
    Write-Host "Đã tạo file .env thành công!" -ForegroundColor Green
} else {
    Write-Host "Đã tìm thấy file .env" -ForegroundColor Green
    
    # Kiểm tra xem DATABASE_URL có trong file .env không
    $envContent = Get-Content -Path ".env" -Raw
    if (-not ($envContent -match "DATABASE_URL=")) {
        Write-Host "Không tìm thấy DATABASE_URL trong file .env" -ForegroundColor Yellow
        
        # Hỏi người dùng về DATABASE_URL
        $databaseUrl = Read-Host "Nhập DATABASE_URL của Neon PostgreSQL"
        
        # Thêm DATABASE_URL vào file .env
        "DATABASE_URL=`"$databaseUrl`"" | Out-File -FilePath ".env" -Append -Encoding utf8
        
        Write-Host "Đã thêm DATABASE_URL vào file .env" -ForegroundColor Green
    }
}

# Cài đặt dependencies
Write-Host "Kiểm tra và cài đặt dependencies..." -ForegroundColor Cyan
npm install

# Tạo Prisma client
Write-Host "Tạo Prisma client..." -ForegroundColor Cyan
npx prisma generate

# Đẩy schema lên database
Write-Host "Đẩy schema lên database..." -ForegroundColor Cyan
npx prisma db push

# Kiểm tra kết nối
Write-Host "Kiểm tra kết nối database..." -ForegroundColor Cyan
$testResult = npx prisma db pull --print

if ($LASTEXITCODE -eq 0) {
    Write-Host "Kết nối database thành công!" -ForegroundColor Green
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "  KHỞI TẠO HOÀN TẤT - READY TO GO  " -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Chạy 'npm run dev' để khởi động ứng dụng" -ForegroundColor Cyan
} else {
    Write-Host "Lỗi kết nối database. Vui lòng kiểm tra lại DATABASE_URL" -ForegroundColor Red
    Write-Host ""
    Write-Host "Gợi ý:" -ForegroundColor Yellow
    Write-Host "1. Kiểm tra định dạng DATABASE_URL trong file .env" -ForegroundColor Yellow
    Write-Host "2. Đảm bảo database đã được tạo trên Neon" -ForegroundColor Yellow
    Write-Host "3. Kiểm tra kết nối internet" -ForegroundColor Yellow
}
