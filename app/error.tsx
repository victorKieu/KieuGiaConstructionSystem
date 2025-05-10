"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Ghi log lỗi cho server
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Đã xảy ra lỗi</h1>
        <p className="text-gray-600 mb-8">Chúng tôi đã ghi nhận lỗi này và sẽ khắc phục sớm nhất có thể.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Quay lại Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
