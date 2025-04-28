"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus, Search, Trash } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default function InventoryItems() {
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const items = [
    {
      id: 1,
      code: "VL001",
      name: "Xi măng PCB40",
      description: "Xi măng Portland composite PCB40",
      category: "Vật liệu xây dựng",
      unit: "Tấn",
      currentQuantity: 100,
      minimumQuantity: 20,
      unitPrice: 1650000,
      warehouse: "Kho chính",
      status: "Có sẵn",
    },
    {
      id: 2,
      code: "VL002",
      name: "Cát xây dựng",
      description: "Cát xây dựng đạt chuẩn",
      category: "Vật liệu xây dựng",
      unit: "M3",
      currentQuantity: 200,
      minimumQuantity: 50,
      unitPrice: 350000,
      warehouse: "Kho chính",
      status: "Có sẵn",
    },
    {
      id: 3,
      code: "VL003",
      name: "Thép xây dựng Φ10",
      description: "Thép xây dựng đường kính 10mm",
      category: "Vật liệu xây dựng",
      unit: "Tấn",
      currentQuantity: 50,
      minimumQuantity: 10,
      unitPrice: 15000000,
      warehouse: "Kho chính",
      status: "Có sẵn",
    },
    {
      id: 4,
      code: "VL004",
      name: "Gạch ốp lát 60x60",
      description: "Gạch ceramic cao cấp",
      category: "Vật liệu hoàn thiện",
      unit: "M2",
      currentQuantity: 1000,
      minimumQuantity: 200,
      unitPrice: 250000,
      warehouse: "Kho chính",
      status: "Có sẵn",
    },
    {
      id: 5,
      code: "TB001",
      name: "Dây điện 2x1.5",
      description: "Dây điện đôi tiết diện 1.5mm2",
      category: "Thiết bị điện",
      unit: "Mét",
      currentQuantity: 5000,
      minimumQuantity: 1000,
      unitPrice: 15000,
      warehouse: "Kho chính",
      status: "Có sẵn",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Có sẵn":
        return "bg-green-100 text-green-800"
      case "Sắp hết":
        return "bg-yellow-100 text-yellow-800"
      case "Hết hàng":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= 0) return "Hết hàng"
    if (current <= minimum) return "Sắp hết"
    return "Có sẵn"
  }

  const handleAddItem = () => {
    // Xử lý thêm vật tư mới
    setIsAddingItem(false)
  }

  // Lọc danh sách vật tư theo từ khóa tìm kiếm
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Danh sách vật tư</CardTitle>
          <CardDescription>Quản lý vật tư trong kho</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm vật tư..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm vật tư
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Thêm vật tư mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho vật tư mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Mã vật tư
                  </Label>
                  <Input id="code" placeholder="Nhập mã vật tư" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên vật tư
                  </Label>
                  <Input id="name" placeholder="Nhập tên vật tư" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea id="description" placeholder="Nhập mô tả vật tư" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Danh mục
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Vật liệu xây dựng</SelectItem>
                      <SelectItem value="finishing">Vật liệu hoàn thiện</SelectItem>
                      <SelectItem value="electrical">Thiết bị điện</SelectItem>
                      <SelectItem value="plumbing">Thiết bị nước</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="warehouse" className="text-right">
                    Kho
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn kho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Kho chính</SelectItem>
                      <SelectItem value="equipment">Kho thiết bị</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Đơn vị tính
                  </Label>
                  <Input id="unit" placeholder="Nhập đơn vị tính" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentQuantity" className="text-right">
                    Số lượng hiện tại
                  </Label>
                  <Input
                    id="currentQuantity"
                    type="number"
                    placeholder="Nhập số lượng hiện tại"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minimumQuantity" className="text-right">
                    Số lượng tối thiểu
                  </Label>
                  <Input
                    id="minimumQuantity"
                    type="number"
                    placeholder="Nhập số lượng tối thiểu"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unitPrice" className="text-right">
                    Đơn giá
                  </Label>
                  <Input id="unitPrice" type="number" placeholder="Nhập đơn giá" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddItem}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã vật tư</TableHead>
              <TableHead>Tên vật tư</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Thành tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{item.currentQuantity}</span>
                    <span className="text-xs text-gray-500">Tối thiểu: {item.minimumQuantity}</span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                <TableCell>{formatCurrency(item.currentQuantity * item.unitPrice)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(getStockStatus(item.currentQuantity, item.minimumQuantity))}>
                    {getStockStatus(item.currentQuantity, item.minimumQuantity)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
