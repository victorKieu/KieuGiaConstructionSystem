# Script để thiết lập cơ sở dữ liệu cho dự án Kieu Gia Construction

Write-Host "Bắt đầu thiết lập cơ sở dữ liệu..." -ForegroundColor Green

# Kiểm tra xem đã cài đặt Prisma CLI chưa
try {
    $prismaVersion = npx prisma --version
    Write-Host "Đã cài đặt Prisma CLI: $prismaVersion" -ForegroundColor Green
} catch {
    Write-Host "Cài đặt Prisma CLI..." -ForegroundColor Yellow
    npm install prisma --save-dev
}

# Kiểm tra file .env
if (Test-Path ".env") {
    Write-Host "File .env đã tồn tại." -ForegroundColor Green
    
    # Đọc nội dung file .env
    $envContent = Get-Content ".env" -Raw
    
    # Kiểm tra xem DATABASE_URL có tồn tại không
    if ($envContent -match "DATABASE_URL=") {
        Write-Host "DATABASE_URL đã được cấu hình trong file .env." -ForegroundColor Green
    } else {
        Write-Host "DATABASE_URL chưa được cấu hình trong file .env." -ForegroundColor Yellow
        Write-Host "Vui lòng thêm DATABASE_URL vào file .env." -ForegroundColor Yellow
        
        # Mở file .env để chỉnh sửa
        notepad ".env"
    }
} else {
    Write-Host "Tạo file .env..." -ForegroundColor Yellow
    
    # Tạo file .env với nội dung mẫu
    @"
# Neon Database
DATABASE_URL="postgresql://neondb_owner:npg_cbyjBd0nvA9f@ep-long-fire-a4le6pq1-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "Đã tạo file .env với DATABASE_URL mẫu." -ForegroundColor Green
}

# Tạo Prisma client
Write-Host "Tạo Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Đẩy schema lên database
Write-Host "Đẩy schema lên database..." -ForegroundColor Yellow
npx prisma db push

Write-Host "Thiết lập cơ sở dữ liệu hoàn tất!" -ForegroundColor Green
Write-Host "Bạn có thể khởi động server với lệnh: npm run dev" -ForegroundColor Green
