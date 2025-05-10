import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Kieu Gia Construction Management</h1>

        <div className="space-y-4">
          <p className="text-gray-600 text-center">Hệ thống quản lý xây dựng Kieu Gia</p>

          <div className="flex justify-center">
            <Link
              href="/login"
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
