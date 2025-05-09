"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-amber-600 mb-4">Không tìm thấy trang</h2>
        <p className="text-gray-600 mb-6">Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <div className="flex space-x-4">
          <Link
            href="/"
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 text-center"
          >
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  )
}
