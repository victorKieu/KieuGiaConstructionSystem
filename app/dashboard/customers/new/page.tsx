import { CustomerForm } from "@/components/dashboard/customer-form"

export const metadata = {
  title: "Thêm khách hàng mới",
  description: "Tạo thông tin khách hàng mới trong hệ thống",
}

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thêm khách hàng mới</h1>
        <p className="text-muted-foreground">Nhập thông tin chi tiết để tạo khách hàng mới trong hệ thống</p>
      </div>
      <CustomerForm />
    </div>
  )
}
