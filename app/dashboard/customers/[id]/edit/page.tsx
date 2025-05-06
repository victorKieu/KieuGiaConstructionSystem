import { notFound } from "next/navigation"
import { CustomerForm } from "@/components/dashboard/customer-form"
import { getCustomerById } from "@/lib/actions/customer-actions"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const customerResult = await getCustomerById(params.id)
  const customer = customerResult.success ? customerResult.data : null

  if (!customer) {
    return {
      title: "Khách hàng không tồn tại",
      description: "Không tìm thấy thông tin khách hàng",
    }
  }

  return {
    title: `Chỉnh sửa ${customer.name}`,
    description: `Chỉnh sửa thông tin khách hàng ${customer.name}`,
  }
}

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  const customerResult = await getCustomerById(params.id)
  const customer = customerResult.success ? customerResult.data : null

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa khách hàng</h1>
        <p className="text-muted-foreground">Cập nhật thông tin khách hàng {customer.name}</p>
      </div>

      <CustomerForm initialData={customer} isEditing />
    </div>
  )
}
