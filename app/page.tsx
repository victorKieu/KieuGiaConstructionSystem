import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
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
    // const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
        redirect("/dashboard")
    } else {
        redirect("/login")
    }

    // Phần code dưới đây không bao giờ được thực thi vì luôn redirect trước đó
    // Nên xóa hoặc chuyển sang trang login
}