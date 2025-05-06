import { CustomerForm } from "@/components/dashboard/customer-form"
import { getCustomerById } from "@/lib/actions/customer-actions"
import { notFound } from "next/navigation"

export default async function EditCustomerPage({
  params,
}: {
  params: { id: string }
}) {
  // Kiểm tra xem khách hàng có tồn tại không
  const result = await getCustomerById(params.id)

  if (result.error || !result.data) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <CustomerForm customerId={params.id} />
    </div>
  )
}
