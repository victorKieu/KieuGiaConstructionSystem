"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Database, RefreshCw, Terminal } from "lucide-react"

export default function DatabaseChecker() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("Đang kiểm tra kết nối...")
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)

  const checkConnection = async () => {
    try {
      setIsChecking(true)
      setStatus("loading")
      setMessage("Đang kiểm tra kết nối...")
      setError(null)

      // Thêm timestamp để tránh cache
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/debug?t=${timestamp}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()
      setDebugInfo(data)

      if (data.database.status === "connected") {
        setStatus("success")
        setMessage("Kết nối cơ sở dữ liệu thành công")
      } else {
        setStatus("error")
        setMessage("Lỗi kết nối cơ sở dữ liệu")
        setError(data.database.error || "Không có thông tin lỗi")
      }
    } catch (error) {
      console.error("Error checking connection:", error)
      setStatus("error")
      setMessage("Lỗi không xác định khi kiểm tra kết nối")
      setError(String(error))
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const runPrismaMigrate = async () => {
    try {
      setIsChecking(true)
      setMessage("Đang chạy Prisma migrate...")

      const response = await fetch("/api/prisma-migrate", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Prisma migrate thành công")
        // Kiểm tra lại kết nối
        checkConnection()
      } else {
        setStatus("error")
        setMessage("Lỗi khi chạy Prisma migrate")
        setError(data.error || "Không có thông tin lỗi")
      }
    } catch (error) {
      console.error("Error running Prisma migrate:", error)
      setStatus("error")
      setMessage("Lỗi không xác định khi chạy Prisma migrate")
      setError(String(error))
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Trạng thái kết nối cơ sở dữ liệu
          </CardTitle>
          <Badge
            variant={status === "success" ? "success" : status === "error" ? "destructive" : "outline"}
            className="flex items-center gap-1"
          >
            {status === "success" ? (
              <CheckCircle className="h-3 w-3" />
            ) : status === "error" ? (
              <AlertCircle className="h-3 w-3" />
            ) : (
              <RefreshCw className="h-3 w-3 animate-spin" />
            )}
            {status === "success" ? "Đã kết nối" : status === "error" ? "Lỗi kết nối" : "Đang kiểm tra"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Alert
          variant={status === "success" ? "default" : status === "error" ? "destructive" : "default"}
          className="mb-4"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{message}</AlertTitle>
          {error && (
            <AlertDescription>
              <div className="mt-2">
                <p className="font-medium text-sm">Chi tiết lỗi:</p>
                <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40 mt-1">{error}</pre>
              </div>
            </AlertDescription>
          )}
        </Alert>

        {debugInfo && (
          <div className="text-sm space-y-2 mt-4">
            <h3 className="font-semibold">Thông tin chi tiết:</h3>

            <div className="mt-2">
              <p className="font-semibold">Database:</p>
              <p>
                <strong>URL:</strong> {debugInfo.database.url}
              </p>
              <p>
                <strong>Trạng thái:</strong> {debugInfo.database.status === "connected" ? "Đã kết nối" : "Lỗi kết nối"}
              </p>
              {debugInfo.database.tables && (
                <p>
                  <strong>Số bảng:</strong> {debugInfo.database.tables.length}
                </p>
              )}
            </div>

            <div className="mt-2">
              <p className="font-semibold">Schema:</p>
              <p>
                <strong>Trạng thái:</strong> {debugInfo.schema.status === "valid" ? "Hợp lệ" : "Lỗi"}
              </p>
            </div>

            <div className="mt-2">
              <p className="font-semibold">Tạo dự án:</p>
              <p>
                <strong>Trạng thái:</strong> {debugInfo.projectCreation.status === "success" ? "Thành công" : "Lỗi"}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={checkConnection} disabled={isChecking} className="w-full">
          {isChecking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Kiểm tra lại
            </>
          )}
        </Button>

        <Button onClick={runPrismaMigrate} disabled={isChecking} variant="outline" className="w-full">
          <Terminal className="mr-2 h-4 w-4" />
          Chạy Prisma Migrate
        </Button>
      </CardFooter>
    </Card>
  )
}
