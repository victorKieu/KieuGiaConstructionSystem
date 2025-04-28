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
import { CalendarIcon, Edit, Plus, Search, Wrench } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function InventoryEquipment() {
  const [isAddingEquipment, setIsAddingEquipment] = useState(false)
  const [purchaseDate, setPurchaseDate] = useState<Date>()
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")

  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const equipment = [
    {
      id: 1,
      code: "TB001",
      name: "Máy trộn bê tông",
      description: "Máy trộn bê tông 350L",
      category: "Thiết bị xây dựng",
      serialNumber: "MTB-001-2022",
      manufacturer: "Công ty CP Máy xây dựng ABC",
      purchaseDate: "2022-01-15",
      purchasePrice: 25000000,
      currentLocation: "Kho thiết bị",
      assignedTo: null,
      status: "Sẵn sàng",
      lastMaintenanceDate: "2023-01-15",
      nextMaintenanceDate: "2023-07-15",
      maintenanceCycle: 6,
    },
    {
      id: 2,
      code: "TB002",
      name: "Máy đầm bê tông",
      description: "Máy đầm bê tông cầm tay",
      category: "Thiết bị xây dựng",
      serialNumber: "MDB-002-2022",
      manufacturer: "Công ty CP Máy xây dựng ABC",
      purchaseDate: "2022-02-20",
      purchasePrice: 15000000,
      currentLocation: "Dự án Chung cư ABC",
      assignedTo: "Nguyễn Văn A",
      status: "Đang sử dụng",
      lastMaintenanceDate: "2023-02-20",
      nextMaintenanceDate: "2023-08-20",
      maintenanceCycle: 6,
    },
    {
      id: 3,
      code: "TB003",
      name: "Máy cắt sắt",
      description: "Máy cắt sắt công suất lớn",
      category: "Thiết bị xây dựng",
      serialNumber: "MCS-003-2022",
      manufacturer: "Công ty CP Máy xây dựng XYZ",
      purchaseDate: "2022-03-10",
      purchasePrice: 18000000,
      currentLocation: "Kho thiết bị",
      assignedTo: null,
      status: "Đang bảo trì",
      lastMaintenanceDate: "2023-03-10",
      nextMaintenanceDate: "2023-09-10",
      maintenanceCycle: 6,
    },
    {
      id: 4,
      code: "TB004",
      name: "Máy phát điện",
      description: "Máy phát điện 20KVA",
      category: "Thiết bị điện",
      serialNumber: "MPD-004-2022",
      manufacturer: "Công ty CP Máy xây dựng XYZ",
      purchaseDate: "2022-04-05",
      purchasePrice: 50000000,
      currentLocation: "Dự án Biệt thự XYZ",
      assignedTo: "Trần Thị B",
      status: "Đang sử dụng",
      lastMaintenanceDate: "2023-04-05",
      nextMaintenanceDate: "2023-10-05",
      maintenanceCycle: 6,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sẵn sàng":
        return "bg-green-100 text-green-800"
      case "Đang sử dụng":
        return "bg-blue-100 text-blue-800"
      case "Đang bảo trì":
        return "bg-yellow-100 text-yellow-800"
      case "Hỏng":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddEquipment = () => {
    // Xử lý thêm thiết bị mới
    setIsAddingEquipment(false)
  }

  // Lọc danh sách thiết bị theo từ khóa tìm kiếm
  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Thiết bị</CardTitle>
          <CardDescription>Quản lý thiết bị xây dựng</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm thiết bị..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddingEquipment} onOpenChange={setIsAddingEquipment}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm thiết bị
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Thêm thiết bị mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho thiết bị mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Mã thiết bị
                  </Label>
                  <Input id="code" placeholder="Nhập mã thiết bị" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên thiết bị
                  </Label>
                  <Input id="name" placeholder="Nhập tên thiết bị" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Mô tả
                  </Label>
                  <Textarea id="description" placeholder="Nhập mô tả thiết bị" className="col-span-3" />
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
                      <SelectItem value="construction">Thiết bị xây dựng</SelectItem>
                      <SelectItem value="electrical">Thiết bị điện</SelectItem>
                      <SelectItem value="plumbing">Thiết bị nước</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serialNumber" className="text-right">
                    Số serial
                  </Label>
                  <Input id="serialNumber" placeholder="Nhập số serial" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manufacturer" className="text-right">
                    Nhà sản xuất
                  </Label>
                  <Input id="manufacturer" placeholder="Nhập tên nhà sản xuất" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purchaseDate" className="text-right">
                    Ngày mua
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !purchaseDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {purchaseDate ? format(purchaseDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={purchaseDate} onSelect={setPurchaseDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purchasePrice" className="text-right">
                    Giá mua
                  </Label>
                  <Input id="purchasePrice" type="number" placeholder="Nhập giá mua" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentLocation" className="text-right">
                    Vị trí hiện tại
                  </Label>
                  <Input id="currentLocation" placeholder="Nhập vị trí hiện tại" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maintenanceCycle" className="text-right">
                    Chu kỳ bảo trì (tháng)
                  </Label>
                  <Input id="maintenanceCycle" type="number" placeholder="Nhập chu kỳ bảo trì" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nextMaintenanceDate" className="text-right">
                    Ngày bảo trì tiếp theo
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !nextMaintenanceDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {nextMaintenanceDate ? (
                            format(nextMaintenanceDate, "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={nextMaintenanceDate}
                          onSelect={setNextMaintenanceDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingEquipment(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddEquipment}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã thiết bị</TableHead>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Số serial</TableHead>
              <TableHead>Vị trí hiện tại</TableHead>
              <TableHead>Người sử dụng</TableHead>
              <TableHead>Bảo trì tiếp theo</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.serialNumber}</TableCell>
                <TableCell>{item.currentLocation}</TableCell>
                <TableCell>{item.assignedTo || "Chưa phân công"}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{new Date(item.nextMaintenanceDate).toLocaleDateString("vi-VN")}</span>
                    <span className="text-xs text-gray-500">Chu kỳ: {item.maintenanceCycle} tháng</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Wrench className="h-4 w-4" />
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
