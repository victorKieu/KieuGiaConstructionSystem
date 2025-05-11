"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CustomerForm } from "@/components/dashboard/customer-form"
import { supabase } from "@/lib/supabase/client"

export default function EditCustomerPage() {
    const params = useParams()
    const router = useRouter()
    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchCustomer() {
            try {
                setLoading(true)
                const { data, error } = await supabase.from("customers").select("*").eq("id", params.id).single()

                if (error) {
                    throw error
                }

                setCustomer(data)
            } catch (err) {
                console.error("Error fetching customer:", err)
                setError(err instanceof Error ? err.message : String(err))
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchCustomer()
        }
    }, [params.id])

    if (loading) {
        return <div>Đang tải thông tin khách hàng...</div>
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Lỗi</p>
                <p>Không thể tải thông tin khách hàng. {error}</p>
                <button className="mt-2 text-blue-500 hover:underline" onClick={() => router.back()}>
                    Quay lại
                </button>
            </div>
        )
    }

    if (!customer) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <p className="font-bold">Không tìm thấy</p>
                <p>Không tìm thấy thông tin khách hàng với ID: {params.id}</p>
                <button className="mt-2 text-blue-500 hover:underline" onClick={() => router.back()}>
                    Quay lại
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa khách hàng</h1>
                <p className="text-muted-foreground">Cập nhật thông tin chi tiết của khách hàng</p>
            </div>
            <CustomerForm customer={customer} />
        </div>
    )
}
