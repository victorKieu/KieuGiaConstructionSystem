# Script để xóa cache và khởi động lại ứng dụng

Write-Host "=== Xóa cache và khởi động lại ứng dụng ===" -ForegroundColor Cyan

# Dừng các tiến trình Node.js đang chạy (tùy chọn)
# Stop-Process -Name "node" -ErrorAction SilentlyContinue

# Xóa thư mục .next nếu tồn tại
if (Test-Path ".next") {
    Write-Host "Đang xóa thư mục .next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
    Write-Host "Đã xóa thư mục .next" -ForegroundColor Green
} else {
    Write-Host "Thư mục .next không tồn tại" -ForegroundColor Yellow
}

# Xóa cache npm (tùy chọn)
Write-Host "Đang xóa cache npm..." -ForegroundColor Yellow
npm cache clean --force

# Cập nhật file projects/page.tsx
Write-Host "Đang cập nhật file projects/page.tsx..." -ForegroundColor Yellow
@"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import Link from "next/link"
import ProjectsList from "@/components/projects/projects-list"
import DbConnectionChecker from "@/components/db-connection-checker"

export default function ProjectsPage() {
return (
  <div className="container mx-auto py-6">
    <h1 className="text-2xl font-bold mb-6">Quản lý dự án</h1>

    <DbConnectionChecker />

    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold">Danh sách dự án</h2>
        <p className="text-muted-foreground">Quản lý tất cả các dự án xây dựng</p>
      </div>
      <Button asChild className="mt-4 md:mt-0">
        <Link href="/dashboard/projects/create">
          <PlusCircle className="mr-2 h-4 w-4" />
          Tạo dự án mới
        </Link>
      </Button>
    </div>

    <ProjectsList />
  </div>
)
}
"@ | Out-File -FilePath "app/dashboard/projects/page.tsx" -Encoding utf8

Write-Host "Đã cập nhật file projects/page.tsx" -ForegroundColor Green

# Khởi động lại ứng dụng
Write-Host "Đang khởi động lại ứng dụng..." -ForegroundColor Green
npm run dev
