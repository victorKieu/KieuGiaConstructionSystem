"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

export default function DbConnectionChecker() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("Đang kiểm tra kết nối...")
  const [tables, setTables] = useState<any[]>([])
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
      const response = await fetch(`/api/db-check?t=${timestamp}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()

      if (data.status === "success") {
        setStatus("success")
        setMessage(data.message || "Kết nối thành công")
        setTables(data.tables || [])
      } else {
        setStatus("error")
        setMessage(data.message || "Lỗi kết nối")
        setError(data.error || "Không có thông tin lỗi")
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

        {status === "success" && (
          <div className="text-sm">
            <p className="font-medium">Cơ sở dữ liệu đã sẵn sàng sử dụng!</p>
            {tables.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Các bảng trong cơ sở dữ liệu:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {tables.map((table: any, index: number) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {table.table_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
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
      </CardFooter>
    </Card>
  )
}
