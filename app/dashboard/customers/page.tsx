import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomerList } from "@/components/dashboard/customer-list"
import { getCustomers } from "@/lib/actions/customer-actions"
import { isSupabaseReady } from "@/lib/supabase/client"

export const metadata = {
  title: "Quản lý khách hàng",
  description: "Quản lý thông tin khách hàng của công ty",
}

export default async function CustomersPage() {
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

  try {
    // Lấy danh sách khách hàng từ cơ sở dữ liệu
    const customersResult = await getCustomers()
    const customers = customersResult.success ? customersResult.data : []

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quản lý khách hàng</h1>
            <p className="text-muted-foreground">Quản lý thông tin khách hàng và đối tác</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/customers/new">
              <Plus className="mr-2 h-4 w-4" /> Thêm khách hàng
            </Link>
          </Button>
        </div>

        <Suspense fallback={<div>Đang tải danh sách khách hàng...</div>}>
          <CustomerList customers={customers} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error in CustomersPage:", error)
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Lỗi</p>
          <p>Đã xảy ra lỗi khi tải danh sách khách hàng. Vui lòng thử lại sau.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    )
  }
}
