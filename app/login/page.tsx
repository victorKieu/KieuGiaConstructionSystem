import LoginFormSupabase from "@/components/auth/login-form-supabase"
import { isSupabaseReady } from "@/lib/supabase/client"

export default function LoginPage() {
    // Kiểm tra xem Supabase có sẵn sàng không
    if (typeof window === "undefined" && !isSupabaseReady()) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                    <p className="font-bold">Cảnh báo</p>
                    <p>Không thể kết nối đến Supabase. Vui lòng kiểm tra biến môi trường.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Đăng nhập vào tài khoản của bạn
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                    <LoginFormSupabase />
                </div>
            </div>
        </div>
    )
}
