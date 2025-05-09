"use client"

import { Button } from "@/components/ui/button"

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
          <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi nghiêm trọng</h2>
          <p className="mb-6 text-gray-600">Chúng tôi xin lỗi vì sự bất tiện này.</p>
          <div className="flex gap-4">
            <Button onClick={() => reset()} variant="outline">
              Thử lại
            </Button>
            <Button onClick={() => (window.location.href = "/")}>Về trang chủ</Button>
          </div>
        </div>
      </body>
    </html>
  )
}
