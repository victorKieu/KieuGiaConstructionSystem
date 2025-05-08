import { notFound } from "next/navigation"
import { CustomerForm } from "@/components/dashboard/customer-form"
import { getCustomerById } from "@/lib/actions/customer-actions"

export const metadata = {
  title: "Chỉnh sửa khách hàng",
  description: "Cập nhật thông tin khách hàng",
}

export default async function EditCustomerPage({ params }) {
  const { id } = params
  const result = await getCustomerById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa khách hàng</h1>
        <p className="text-muted-foreground">Cập nhật thông tin chi tiết của khách hàng</p>
      </div>
      <CustomerForm customer={result.data} />
    </div>
  )
}
