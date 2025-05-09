import { createClient } from "@/lib/supabase/client"
import { isSupabaseReady } from "@/lib/supabase/client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ProjectPage({ params }: { params: { id: string } }) {
  // Kiểm tra xem Supabase có sẵn sàng không
  if (!isSupabaseReady()) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Cảnh báo</p>
          <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
        </div>
      </div>
    )
  }

  try {
    // Lấy thông tin dự án
    const supabase = createClient()
    const { data: project, error } = await supabase.from("projects").select("*").eq("id", params.id).single()

    if (error || !project) {
      return notFound()
    }

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
        {/* Hiển thị thông tin dự án */}
      </div>
    )
  } catch (error) {
    console.error("Error fetching project:", error)
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Lỗi</p>
          <p>Đã xảy ra lỗi khi lấy thông tin dự án.</p>
        </div>
      </div>
    )
  }
}
