"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

export default function CustomerDebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [customers, setCustomers] = useState([])

  // Lấy danh sách khách hàng khi trang được tải
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Hàm lấy danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/debug/customers-crud?action=list")
      const data = await response.json()

      if (data.success && data.data) {
        setCustomers(data.data)
        if (data.data.length > 0) {
          setSelectedCustomerId(data.data[0].id)
        }
      } else {
        setError(data.error || "Không thể lấy danh sách khách hàng")
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi lấy danh sách khách hàng")
    } finally {
      setLoading(false)
    }
  }

  // Hàm thực hiện các thao tác CRUD
  const performAction = async (action) => {
    try {
      setLoading(true)
      setResult(null)
      setError(null)

      let url = `/api/debug/customers-crud?action=${action}`
      if (action !== "create" && action !== "list") {
        if (!selectedCustomerId) {
          setError("Vui lòng chọn một khách hàng")
          setLoading(false)
          return
        }
        url += `&id=${selectedCustomerId}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setResult(data)
        // Nếu thao tác thành công, cập nhật lại danh sách khách hàng
        if (action !== "get") {
          await fetchCustomers()
        }
      } else {
        setError(data.error || "Thao tác không thành công")
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi thực hiện thao tác")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Debug Quản lý Khách hàng</h1>
      <p className="text-muted-foreground">
        Trang này giúp kiểm tra các thao tác CRUD trên bảng customers trong Supabase
      </p>

      <Tabs defaultValue="actions">
        <TabsList>
          <TabsTrigger value="actions">Thao tác CRUD</TabsTrigger>
          <TabsTrigger value="connection">Kiểm tra kết nối</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thao tác CRUD</CardTitle>
              <CardDescription>Kiểm tra các thao tác Tạo, Đọc, Cập nhật, Xóa trên bảng customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chọn khách hàng:</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                  >
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.code || "No code"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                <Button onClick={() => performAction("list")} disabled={loading}>
                  Liệt kê
                </Button>
                <Button onClick={() => performAction("get")} disabled={loading || !selectedCustomerId}>
                  Xem chi tiết
                </Button>
                <Button onClick={() => performAction("create")} disabled={loading}>
                  Tạo mẫu
                </Button>
                <Button onClick={() => performAction("update")} disabled={loading || !selectedCustomerId}>
                  Cập nhật
                </Button>
                <Button
                  onClick={() => performAction("delete")}
                  disabled={loading || !selectedCustomerId}
                  variant="destructive"
                  className="col-span-2 md:col-span-4"
                >
                  Xóa
                </Button>
              </div>

              {loading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Đang xử lý...</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <Alert className="bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle>Thành công - {result.action}</AlertTitle>
                  <AlertDescription>
                    <pre className="mt-2 w-full overflow-auto rounded-md bg-slate-950 p-4 text-xs text-white">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Kiểm tra kết nối Supabase</CardTitle>
              <CardDescription>Kiểm tra kết nối đến Supabase và cấu trúc bảng customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true)
                      setResult(null)
                      setError(null)

                      const response = await fetch("/api/debug/customers-check")
                      const data = await response.json()

                      if (data.success) {
                        setResult(data)
                      } else {
                        setError(data.error || "Không thể kết nối đến Supabase")
                      }
                    } catch (err) {
                      setError(err.message || "Đã xảy ra lỗi khi kiểm tra kết nối")
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                >
                  Kiểm tra kết nối
                </Button>

                {loading && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Đang kiểm tra kết nối...</span>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Lỗi kết nối</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {result && (
                  <Alert className="bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Kết nối thành công</AlertTitle>
                    <AlertDescription>
                      <pre className="mt-2 w-full overflow-auto rounded-md bg-slate-950 p-4 text-xs text-white">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
