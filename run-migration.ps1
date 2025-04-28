# Chạy migration để tạo bảng
Write-Host "Đang chạy migration để tạo bảng..." -ForegroundColor Green

try {
    # Đọc file SQL
    $sqlContent = Get-Content -Path "prisma/migrations/create_tables.sql" -Raw
    
    # Lấy DATABASE_URL từ .env
    $envContent = Get-Content -Path ".env" -Raw
    $databaseUrl = $envContent -split "`n" | Where-Object { $_ -match "DATABASE_URL" } | ForEach-Object { $_ -replace "DATABASE_URL=", "" }
    
    # Chạy SQL với psql
    $env:PGPASSWORD = $databaseUrl -replace ".*:(.*)@.*", '$1'
    $dbHost = $databaseUrl -replace ".*@(.*):", '$1'
    $dbPort = $databaseUrl -replace ".*:(\d+)/.*", '$1'
    $dbName = $databaseUrl -replace ".*/([^?]*)", '$1'
    $dbUser = $databaseUrl -replace ".*://([^:]*):.*", '$1'
    
    # Lưu SQL vào file tạm
    $tempFile = [System.IO.Path]::GetTempFileName()
    $sqlContent | Out-File -FilePath $tempFile -Encoding utf8
    
    # Chạy psql
    psql -h $dbHost -p $dbPort -d $dbName -U $dbUser -f $tempFile
    
    # Xóa file tạm
    Remove-Item -Path $tempFile
    
    Write-Host "Migration thành công!" -ForegroundColor Green
} catch {
    Write-Host "Lỗi khi chạy migration: $_" -ForegroundColor Red
}
