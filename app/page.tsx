import { isSupabaseReady } from "@/lib/supabase/client"

export default function HomePage() {
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Trang chủ</h1>
            {/* Nội dung trang chủ */}
        </div>
    )
}
