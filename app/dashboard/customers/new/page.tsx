import { CustomerForm } from "@/components/dashboard/customer-form"

export const metadata = {
  title: "Thêm khách hàng mới",
  description: "Tạo khách hàng mới trong hệ thống",
}

export default function NewCustomerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Thêm khách hàng mới</h1>
        <p className="text-muted-foreground">Tạo khách hàng mới trong hệ thống</p>
      </div>

      <CustomerForm />
    </div>
  )
}
