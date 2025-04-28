# Script kiểm tra và cập nhật file .env

# Kiểm tra xem file .env có tồn tại không
if (-not (Test-Path ".env")) {
    Write-Host "File .env không tồn tại. Đang tạo file..." -ForegroundColor Yellow
    
    # Tạo file .env với nội dung mẫu
    @"
# Neon Database
DATABASE_URL="postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "Đã tạo file .env. Vui lòng cập nhật thông tin kết nối cơ sở dữ liệu." -ForegroundColor Green
} else {
    Write-Host "File .env đã tồn tại." -ForegroundColor Green
    
    # Kiểm tra xem DATABASE_URL có tồn tại trong file .env không
    $envContent = Get-Content ".env" -Raw
    if (-not ($envContent -match "DATABASE_URL=")) {
        Write-Host "Không tìm thấy DATABASE_URL trong file .env. Đang thêm..." -ForegroundColor Yellow
        
        # Thêm DATABASE_URL vào file .env
        @"
# Neon Database
DATABASE_URL="postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require"
"@ | Out-File -FilePath ".env" -Append -Encoding utf8
        
        Write-Host "Đã thêm DATABASE_URL vào file .env. Vui lòng cập nhật thông tin kết nối cơ sở dữ liệu." -ForegroundColor Green
    } else {
        Write-Host "DATABASE_URL đã tồn tại trong file .env." -ForegroundColor Green
    }
}

# Hiển thị hướng dẫn
Write-Host "`nHướng dẫn cập nhật DATABASE_URL:" -ForegroundColor Cyan
Write-Host "1. Mở file .env trong trình soạn thảo văn bản" -ForegroundColor White
Write-Host "2. Tìm dòng bắt đầu bằng DATABASE_URL=" -ForegroundColor White
Write-Host "3. Cập nhật URL kết nối cơ sở dữ liệu Neon PostgreSQL" -ForegroundColor White
Write-Host "4. Lưu file và khởi động lại server với lệnh 'npm run dev'" -ForegroundColor White

# Hỏi người dùng có muốn mở file .env không
$openFile = Read-Host "Bạn có muốn mở file .env để chỉnh sửa không? (y/n)"
if ($openFile -eq "y") {
    # Mở file .env bằng trình soạn thảo mặc định
    Invoke-Item ".env"
}
