"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorSafePage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        setLoading(true)
        const response = await fetch("/api/debug-error")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDebugInfo(data)
      } catch (err: any) {
        console.error("Error fetching debug info:", err)
        setError(err.message || "Không thể tải thông tin debug")
      } finally {
        setLoading(false)
      }
    }

    fetchDebugInfo()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Trang Kiểm Tra Lỗi</h1>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin môi trường</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(debugInfo?.environment, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Trạng thái kết nối database</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="font-semibold">Trạng thái: </span>
                <span className={debugInfo?.database?.status === "success" ? "text-green-500" : "text-red-500"}>
                  {debugInfo?.database?.status}
                </span>
              </div>

              {debugInfo?.database?.error && (
                <div className="mb-4">
                  <span className="font-semibold">Lỗi: </span>
                  <span className="text-red-500">{debugInfo.database.error}</span>
                </div>
              )}

              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(debugInfo?.database, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button asChild>
              <Link href="/dashboard">Thử lại Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Làm mới thông tin
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
