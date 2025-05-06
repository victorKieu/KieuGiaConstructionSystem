import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
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
    // // const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Dashboard"
                text={`Chào mừng ${session.user.email || 'bạn'} đến với hệ thống quản lý xây dựng Kieu Gia.`}
            />
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Chào mừng trở lại!</h2>
                    <p className="text-gray-600">Bạn đã đăng nhập thành công với email: {session.user.email}</p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Dự án</h3>
                            <p className="text-gray-600">Quản lý các dự án xây dựng</p>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Khách hàng</h3>
                            <p className="text-gray-600">Quản lý thông tin khách hàng</p>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Kho vật tư</h3>
                            <p className="text-gray-600">Quản lý kho vật tư và thiết bị</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}