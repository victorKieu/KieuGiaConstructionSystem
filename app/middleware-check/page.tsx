"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

export default function MiddlewareCheckPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkSession() {
      try {
        setLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSessionData(data)
      } catch (err) {
        console.error("Error checking session:", err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Kiểm tra Middleware</CardTitle>
          <CardDescription>Trang này kiểm tra xem middleware xác thực có hoạt động đúng không</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="mb-4 border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
              <p className="font-bold">Lỗi</p>
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <h3 className="mb-2 font-semibold">Trạng thái phiên:</h3>
              <div className="rounded bg-gray-100 p-4">
                <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(sessionData, null, 2)}</pre>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Làm mới
          </Button>
          <Button onClick={() => (window.location.href = "/login")}>Đến trang đăng nhập</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
