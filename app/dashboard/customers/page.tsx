"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CustomerList } from "@/components/dashboard/customer-list"
import { isSupabaseReady } from "@/lib/supabase/client"

export default function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchCustomers() {
            try {
                setLoading(true)
                const response = await fetch("/api/customers")
                if (!response.ok) {
                    throw new Error("Failed to fetch customers")
                }
                const data = await response.json()
                setCustomers(data.success ? data.data : [])
            } catch (err) {
                console.error("Error fetching customers:", err)
                setError(err instanceof Error ? err.message : String(err))
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

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

    if (loading) {
        return <div>Đang tải danh sách khách hàng...</div>
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">Lỗi</p>
                    <p>Đã xảy ra lỗi khi tải danh sách khách hàng. Vui lòng thử lại sau.</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            </div>
        )
    }

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

            <CustomerList customers={customers} />
        </div>
    )
}
