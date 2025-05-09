import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Kieu Gia Construction</h1>
      <p className="mb-8">Hệ thống quản lý xây dựng toàn diện</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
          Đăng nhập
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  )
}
