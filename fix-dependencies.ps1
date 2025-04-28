Write-Host "Fixing dependencies..." -ForegroundColor Green

# Kiểm tra xem next-auth có trong package.json không
$packageJson = Get-Content -Path "package.json" | ConvertFrom-Json
$hasNextAuth = $packageJson.dependencies.PSObject.Properties.Name -contains "next-auth"

if ($hasNextAuth) {
    Write-Host "Removing next-auth from package.json..." -ForegroundColor Yellow
    
    # Tạo một đối tượng mới không có next-auth
    $newDependencies = New-Object PSObject
    foreach ($prop in $packageJson.dependencies.PSObject.Properties) {
        if ($prop.Name -ne "next-auth") {
            $newDependencies | Add-Member -MemberType NoteProperty -Name $prop.Name -Value $prop.Value
        }
    }
    
    # Cập nhật dependencies
    $packageJson.dependencies = $newDependencies
    
    # Lưu lại package.json
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content -Path "package.json"
    
    Write-Host "next-auth has been removed from package.json" -ForegroundColor Green
} else {
    Write-Host "next-auth is not in package.json" -ForegroundColor Green
}

# Xóa node_modules và package-lock.json
Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
}

# Cài đặt lại dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host "Dependencies fixed!" -ForegroundColor Green
