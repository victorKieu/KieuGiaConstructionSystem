import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { ProjectList } from "@/components/dashboard/project-list"
import { getProjects } from "@/lib/actions/project-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export const metadata = {
  title: "Danh sách dự án | Kieu Gia Construction",
  description: "Quản lý thông tin dự án xây dựng",
}

// Đảm bảo trang luôn được render động
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProjectListPage() {
  console.log("Đang render trang danh sách dự án...")

  // Lấy dữ liệu dự án từ Supabase
  const result = await getProjects()

  console.log("Kết quả lấy dự án:", {
    success: result.success,
    errorMessage: result.error,
    dataLength: result.data?.length || 0,
  })

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh sách dự án</h1>
            <p className="text-muted-foreground">Quản lý thông tin dự án xây dựng</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              Thêm dự án mới
            </Link>
          </Button>
        </div>

        {!result.success && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              {result.error || "Không thể lấy danh sách dự án. Vui lòng thử lại sau."}
            </AlertDescription>
          </Alert>
        )}

        {result.success && result.data.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Chưa có dữ liệu</AlertTitle>
            <AlertDescription>Chưa có dự án nào trong hệ thống. Hãy tạo dự án mới để bắt đầu.</AlertDescription>
          </Alert>
        )}

        <ProjectList projects={result.data || []} />
      </div>
    </MainLayout>
  )
}
