import type { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { ProjectList } from "@/components/dashboard/project-list"
import { getProjects } from "@/lib/actions/project-actions"

export const metadata: Metadata = {
  title: "Quản lý dự án | Kieu Gia Construction",
  description: "Quản lý thông tin dự án xây dựng",
}

// Đảm bảo trang luôn được render động
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProjectsPage() {
  // Dữ liệu mẫu dự án để sử dụng khi không thể kết nối với Supabase
  const sampleProjects = [
    {
      id: "1",
      code: "KG-2023-001",
      name: "Chung cư Sunshine City",
      status: "Đang thi công",
      progress: 65,
      construction_type: "Chung cư",
      start_date: "2023-01-15",
      end_date: "2023-12-30",
      complexity: "Cao",
      priority: "Cao",
      budget: 150000000000,
    },
    {
      id: "2",
      code: "KG-2023-002",
      name: "Biệt thự Vinhomes",
      status: "Đã hoàn thành",
      progress: 100,
      construction_type: "Biệt thự",
      start_date: "2023-02-10",
      end_date: "2023-08-20",
      complexity: "Trung bình",
      priority: "Trung bình",
      budget: 25000000000,
    },
    {
      id: "3",
      code: "KG-2023-003",
      name: "Văn phòng Pearl Plaza",
      status: "Chuẩn bị",
      progress: 10,
      construction_type: "Văn phòng",
      start_date: "2023-06-01",
      end_date: "2024-03-30",
      complexity: "Cao",
      priority: "Cao",
      budget: 80000000000,
    },
  ]

  // Thử lấy dữ liệu từ Supabase, nếu lỗi thì sử dụng dữ liệu mẫu
  let projects = []
  try {
    projects = await getProjects()
    console.log("Đã lấy được dữ liệu từ Supabase:", projects.length, "dự án")

    // Nếu không có dự án nào, sử dụng dữ liệu mẫu
    if (!projects || projects.length === 0) {
      console.log("Không có dự án nào từ Supabase, sử dụng dữ liệu mẫu")
      projects = sampleProjects
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dự án từ Supabase:", error)
    console.log("Sử dụng dữ liệu mẫu do lỗi kết nối")
    projects = sampleProjects
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý dự án</h1>
            <p className="text-muted-foreground">Quản lý thông tin dự án xây dựng</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              Thêm dự án mới
            </Link>
          </Button>
        </div>

        <ProjectList projects={projects} />
      </div>
    </MainLayout>
  )
}
