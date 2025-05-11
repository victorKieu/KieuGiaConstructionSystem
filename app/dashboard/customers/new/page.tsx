export const dynamic = "force-dynamic"

import { CustomerForm } from "@/components/dashboard/customer-form"

export const metadata = {
    title: "Thêm khách hàng mới",
    description: "Thêm thông tin khách hàng mới vào hệ thống",
}

export default function NewCustomerPage() {
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
