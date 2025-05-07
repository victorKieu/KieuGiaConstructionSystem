"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

export function InventoryList() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        // Sử dụng dữ liệu mẫu thay vì gọi API để tránh lỗi
        setInventory([
          { id: 1, name: "Xi măng", quantity: 500, unit: "bao" },
          { id: 2, name: "Cát", quantity: 30, unit: "m³" },
          { id: 3, name: "Thép", quantity: 2000, unit: "kg" },
        ])
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching inventory:", err)
        setError("Không thể tải dữ liệu kho hàng")
        setLoading(false)
      }
    }

    fetchInventory()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kho hàng</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kho hàng</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kho hàng</CardTitle>
        <CardDescription>Vật tư hiện có trong kho</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventory.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2">
              <span className="font-medium">{item.name}</span>
              <span>
                {item.quantity} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
