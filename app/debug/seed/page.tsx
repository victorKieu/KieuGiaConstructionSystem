"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Database, Loader2 } from "lucide-react"

export default function SeedDataPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeedData = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/debug/seed-projects")
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Lỗi không xác định")
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Tạo dữ liệu mẫu</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tạo dữ liệu mẫu cho ứng dụng</CardTitle>
          <CardDescription>Tạo dữ liệu mẫu cho các bảng customers và projects để kiểm tra ứng dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Chức năng này sẽ tạo dữ liệu mẫu cho các bảng sau:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              Bảng <strong>customers</strong>: 5 khách hàng mẫu
            </li>
            <li>
              Bảng <strong>projects</strong>: 5 dự án mẫu
            </li>
          </ul>
          <p className="text-amber-600">Lưu ý: Chức năng này chỉ tạo dữ liệu nếu các bảng đang trống.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedData} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo dữ liệu...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Tạo dữ liệu mẫu
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Alert variant={result.success ? "default" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{result.success ? "Thành công" : "Lỗi"}</AlertTitle>
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      {result && result.success && result.customers && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Dữ liệu đã tạo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Khách hàng</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(result.customers, null, 2)}</pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Dự án</h3>
                <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(result.projects, null, 2)}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
