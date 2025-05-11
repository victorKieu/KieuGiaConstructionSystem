export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter } from "lucide-react"

export default function InventoryPage() {
  // Dữ liệu mẫu cho kho hàng
  const inventoryItems = [
    {
      id: 1,
      name: "Xi măng Portland",
      category: "Vật liệu xây dựng",
      quantity: 1200,
      unit: "bao",
      status: "in-stock",
      location: "Kho A",
      lastUpdated: "2023-11-15",
    },
    {
      id: 2,
      name: "Thép xây dựng Φ10",
      category: "Vật liệu xây dựng",
      quantity: 500,
      unit: "cây",
      status: "in-stock",
      location: "Kho B",
      lastUpdated: "2023-11-10",
    },
    {
      id: 3,
      name: "Gạch ốp lát 60x60",
      category: "Vật liệu hoàn thiện",
      quantity: 350,
      unit: "thùng",
      status: "low-stock",
      location: "Kho A",
      lastUpdated: "2023-11-12",
    },
    {
      id: 4,
      name: "Sơn nội thất",
      category: "Vật liệu hoàn thiện",
      quantity: 85,
      unit: "thùng",
      status: "low-stock",
      location: "Kho C",
      lastUpdated: "2023-11-14",
    },
    {
      id: 5,
      name: "Cát xây dựng",
      category: "Vật liệu xây dựng",
      quantity: 45,
      unit: "m³",
      status: "out-of-stock",
      location: "Kho A",
      lastUpdated: "2023-11-08",
    },
    {
      id: 6,
      name: "Đá 1x2",
      category: "Vật liệu xây dựng",
      quantity: 120,
      unit: "m³",
      status: "in-stock",
      location: "Kho B",
      lastUpdated: "2023-11-05",
    },
    {
      id: 7,
      name: "Dây điện 2.5mm",
      category: "Vật liệu điện",
      quantity: 1500,
      unit: "m",
      status: "in-stock",
      location: "Kho C",
      lastUpdated: "2023-11-11",
    },
  ]

  // Hàm hiển thị trạng thái kho hàng
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500">Còn hàng</Badge>
      case "low-stock":
        return <Badge className="bg-amber-500">Sắp hết</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-500">Hết hàng</Badge>
      default:
        return <Badge className="bg-gray-500">Không xác định</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kho hàng</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm vật tư
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Tìm kiếm vật tư..." className="pl-8 bg-white" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Lọc
        </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên vật tư</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Cập nhật lần cuối</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
