"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

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
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="mb-4 text-2xl font-bold">Lỗi hệ thống</h1>
            <p className="mb-6 text-gray-600">
              Rất tiếc, đã xảy ra lỗi nghiêm trọng trong hệ thống. Vui lòng thử lại sau hoặc liên hệ với quản trị viên.
            </p>
            {error.digest && <p className="p-2 mb-4 text-sm bg-gray-100 rounded">Mã lỗi: {error.digest}</p>}
            <div className="flex justify-center gap-4">
              <Button onClick={() => reset()}>Thử lại</Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
