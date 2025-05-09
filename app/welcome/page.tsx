import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Chào mừng đến với Kieu Gia Construction</h1>
      <p className="mb-8">Hệ thống quản lý xây dựng toàn diện</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}
