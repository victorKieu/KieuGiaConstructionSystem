"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi nghiêm trọng</h2>
            <p className="text-gray-600 mb-6">
              Rất tiếc, đã xảy ra lỗi nghiêm trọng trong ứng dụng. Vui lòng thử lại sau hoặc liên hệ với quản trị viên.
            </p>
            <div className="bg-gray-100 p-4 rounded mb-6 overflow-auto">
              <p className="text-sm text-gray-800 font-mono">{error.message || "Unknown error"}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => reset()}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
              >
                Thử lại
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
