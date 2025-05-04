import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect("/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading="Dashboard"
                text={`Chào mừng ${session.user.email || 'bạn'} đến với hệ thống quản lý xây dựng Kieu Gia.`}
            />
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Chào mừng trở lại!</h2>
                    <p className="text-gray-600">Bạn đã đăng nhập thành công với email: {session.user.email}</p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Dự án</h3>
                            <p className="text-gray-600">Quản lý các dự án xây dựng</p>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Khách hàng</h3>
                            <p className="text-gray-600">Quản lý thông tin khách hàng</p>
                        </div>

                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Kho vật tư</h3>
                            <p className="text-gray-600">Quản lý kho vật tư và thiết bị</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}