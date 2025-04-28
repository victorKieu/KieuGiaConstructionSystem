import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function DashboardPage() {
    const headersList = headers()
    const request = {
        url: headersList.get("x-url") || "http://localhost:3000",
    }

    const session = await auth.requireAuth(request)

    // Nếu requireAuth trả về NextResponse, chúng ta sẽ không đến được đây
    // vì NextResponse.redirect sẽ chuyển hướng người dùng

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Bảng điều khiển</h1>

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
    )
}
