"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([
    {
      id: "1",
      name: "Máy xúc Komatsu PC200",
      status: "Đang hoạt động",
      location: "Công trường A",
      lastMaintenance: "15/04/2023",
    },
    {
      id: "2",
      name: "Máy ủi Caterpillar D6",
      status: "Bảo trì",
      location: "Kho thiết bị",
      lastMaintenance: "02/03/2023",
    },
    {
      id: "3",
      name: "Xe tải Howo 15 tấn",
      status: "Đang hoạt động",
      location: "Công trường B",
      lastMaintenance: "10/05/2023",
    },
    {
      id: "4",
      name: "Máy trộn bê tông 350L",
      status: "Đang hoạt động",
      location: "Công trường A",
      lastMaintenance: "20/04/2023",
    },
    {
      id: "5",
      name: "Máy phát điện 100KVA",
      status: "Không hoạt động",
      location: "Kho thiết bị",
      lastMaintenance: "05/02/2023",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const filteredEquipment = equipment.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang hoạt động":
        return "bg-green-100 text-green-800"
      case "Bảo trì":
        return "bg-yellow-100 text-yellow-800"
      case "Không hoạt động":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thiết bị</h1>
          <p className="text-muted-foreground">Quản lý thiết bị và máy móc xây dựng</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Thêm thiết bị
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm thiết bị..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thiết bị</CardTitle>
          <CardDescription>Tổng số: {filteredEquipment.length} thiết bị</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 border-b bg-muted/50 px-4 py-3 text-sm font-medium">
              <div>Tên thiết bị</div>
              <div>Trạng thái</div>
              <div>Vị trí</div>
              <div>Bảo trì gần nhất</div>
              <div className="text-right">Thao tác</div>
            </div>
            <div className="divide-y">
              {loading ? (
                <div className="px-4 py-3 text-center">Đang tải dữ liệu...</div>
              ) : filteredEquipment.length === 0 ? (
                <div className="px-4 py-3 text-center">Không tìm thấy thiết bị nào</div>
              ) : (
                filteredEquipment.map((item) => (
                  <div key={item.id} className="grid grid-cols-5 items-center px-4 py-3">
                    <div className="font-medium">{item.name}</div>
                    <div>
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div>{item.location}</div>
                    <div>{item.lastMaintenance}</div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/equipment/${item.id}`}>Chi tiết</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Sửa
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
