import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProjects } from "@/lib/actions/project-actions"
import { ProjectList } from "@/components/dashboard/project-list"
import { isSupabaseReady } from "@/lib/supabase/client"

export const metadata = {
  title: "Quản lý dự án",
  description: "Quản lý thông tin dự án xây dựng",
}

export default async function ProjectsPage() {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (typeof window === "undefined" && !isSupabaseReady()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Cảnh báo</p>
          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
        </div>
      </div>
    )
  }

  // Lấy danh sách dự án từ cơ sở dữ liệu
  const projectsResult = await getProjects()
  const projects = projectsResult.success ? projectsResult.data : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý dự án</h1>
          <p className="text-muted-foreground">Quản lý thông tin dự án xây dựng và theo dõi tiến độ</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Thêm dự án
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Đang tải...</div>}>
        <ProjectList projects={projects} />
      </Suspense>
    </div>
  )
}
