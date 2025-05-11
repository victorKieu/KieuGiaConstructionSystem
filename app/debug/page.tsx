"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function DebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [envVars, setEnvVars] = useState<any>(null)

  // Kiểm tra kết nối Supabase
  const checkSupabase = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/supabase-check")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: "Lỗi khi gọi API kiểm tra" })
    } finally {
      setLoading(false)
    }
  }

  // Kiểm tra biến môi trường
  const checkEnvVars = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/env-check")
      const data = await response.json()
      setEnvVars(data)
    } catch (error) {
      setEnvVars({ error: "Lỗi khi kiểm tra biến môi trường" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvVars()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trang Debug</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Kiểm tra kết nối Supabase</CardTitle>
            <CardDescription>Kiểm tra kết nối đến cơ sở dữ liệu Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Kết nối thành công" : "Lỗi kết nối"}</AlertTitle>
                <AlertDescription>
                  {result.success ? "Kết nối đến Supabase hoạt động bình thường." : `Lỗi: ${result.error}`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={checkSupabase} disabled={loading}>
              {loading ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biến môi trường</CardTitle>
            <CardDescription>Kiểm tra các biến môi trường cần thiết</CardDescription>
          </CardHeader>
          <CardContent>
            {envVars && (
              <div className="space-y-2">
                {Object.entries(envVars).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-8">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium">{key}:</span>{" "}
                      <span className={value ? "text-green-600" : "text-amber-600"}>
                        {value ? "Đã cấu hình" : "Chưa cấu hình"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn khắc phục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">1. Kiểm tra biến môi trường</h3>
              <p className="text-sm text-muted-foreground">Đảm bảo các biến môi trường sau đã được cấu hình:</p>
              <ul className="list-disc list-inside text-sm ml-4 mt-2">
                <li>NEXT_PUBLIC_SUPABASE_URL</li>
                <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium">2. Kiểm tra kết nối mạng</h3>
              <p className="text-sm text-muted-foreground">Đảm bảo máy chủ có thể kết nối đến Supabase.</p>
            </div>

            <div>
              <h3 className="font-medium">3. Kiểm tra cấu trúc bảng</h3>
              <p className="text-sm text-muted-foreground">
                Đảm bảo các bảng và cột trong cơ sở dữ liệu đã được tạo đúng.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
