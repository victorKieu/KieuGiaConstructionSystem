"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function DebugProjectsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug/check-projects-table")
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Lỗi không xác định")
      } else {
        setData(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Debug Bảng Projects</h1>

      <Button onClick={fetchData} disabled={loading} className="mb-6">
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Đang tải...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin kết nối</CardTitle>
              <CardDescription>Kiểm tra kết nối đến bảng projects</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(data.connection, null, 2)}</pre>
            </CardContent>
          </Card>

          {data.tableInfo && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Cấu trúc bảng</CardTitle>
                <CardDescription>Thông tin về cấu trúc bảng projects</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(data.tableInfo, null, 2)}</pre>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Dữ liệu mẫu</CardTitle>
              <CardDescription>5 bản ghi đầu tiên từ bảng projects</CardDescription>
            </CardHeader>
            <CardContent>
              {data.sampleError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi khi lấy dữ liệu mẫu</AlertTitle>
                  <AlertDescription>{data.sampleError}</AlertDescription>
                </Alert>
              ) : (
                <pre className="bg-muted p-4 rounded-md overflow-auto">{JSON.stringify(data.sampleData, null, 2)}</pre>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {data.sampleData ? `Đã tìm thấy ${data.sampleData.length} bản ghi` : "Không có dữ liệu"}
              </p>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}
