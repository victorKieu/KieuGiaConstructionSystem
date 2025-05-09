"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log lỗi để debug
    console.error("Application error:", error)
  }, [error])

  // Kiểm tra nếu lỗi là Redirect
  const isRedirectError = error.message.includes("Redirect")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">{isRedirectError ? "Đang chuyển hướng..." : "Đã xảy ra lỗi"}</h2>
      <p className="mb-6 text-gray-600">
        {isRedirectError
          ? "Hệ thống đang chuyển hướng bạn đến trang đăng nhập."
          : "Chúng tôi xin lỗi vì sự bất tiện này."}
      </p>
      <div className="flex gap-4">
        {!isRedirectError && (
          <Button onClick={() => reset()} variant="outline">
            Thử lại
          </Button>
        )}
        <Button asChild>
          <Link href="/login">Đến trang đăng nhập</Link>
        </Button>
      </div>
    </div>
  )
}
