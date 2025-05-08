import { CustomerForm } from "@/components/dashboard/customer-form"
import { isSupabaseReady } from "@/lib/supabase/client"

export const metadata = {
  title: "Thêm khách hàng mới",
  description: "Thêm thông tin khách hàng mới vào hệ thống",
}

export default function NewCustomerPage() {
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Thêm khách hàng mới</h1>
        <p className="text-muted-foreground">Nhập thông tin chi tiết để tạo khách hàng mới</p>
      </div>

      <CustomerForm />
    </div>
  )
}
