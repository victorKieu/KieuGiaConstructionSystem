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
import { CalendarIcon, Download, Filter, Plus, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function InventoryTransactions() {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [transactionDate, setTransactionDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [transactionType, setTransactionType] = useState<string | null>(null)

  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const transactions = [
    {
      id: 1,
      type: "Nhập kho",
      itemCode: "VL001",
      itemName: "Xi măng PCB40",
      quantity: 50,
      unit: "Tấn",
      unitPrice: 1650000,
      totalPrice: 82500000,
      date: "2023-05-15",
      referenceNumber: "NK-001",
      supplier: "Công ty TNHH Vật liệu XD ABC",
      project: null,
      notes: "Nhập kho theo hợp đồng HĐ-2023-001",
      createdBy: "Phạm Thị D",
    },
    {
      id: 2,
      type: "Xuất kho",
      itemCode: "VL003",
      itemName: "Thép xây dựng Φ10",
      quantity: 5,
      unit: "Tấn",
      unitPrice: 15000000,
      totalPrice: 75000000,
      date: "2023-05-14",
      referenceNumber: "XK-001",
      supplier: null,
      project: "Chung cư ABC",
      notes: "Xuất kho cho dự án Chung cư ABC",
      createdBy: "Phạm Thị D",
    },
    {
      id: 3,
      type: "Xuất kho",
      itemCode: "VL004",
      itemName: "Gạch ốp lát 60x60",
      quantity: 200,
      unit: "M2",
      unitPrice: 250000,
      totalPrice: 50000000,
      date: "2023-05-13",
      referenceNumber: "XK-002",
      supplier: null,
      project: "Biệt thự XYZ",
      notes: "Xuất kho cho dự án Biệt thự XYZ",
      createdBy: "Phạm Thị D",
    },
    {
      id: 4,
      type: "Nhập kho",
      itemCode: "TB001",
      itemName: "Dây điện 2x1.5",
      quantity: 1000,
      unit: "Mét",
      unitPrice: 15000,
      totalPrice: 15000000,
      date: "2023-05-12",
      referenceNumber: "NK-002",
      supplier: "Công ty CP Thiết bị XD XYZ",
      project: null,
      notes: "Nhập kho theo hợp đồng HĐ-2023-002",
      createdBy: "Phạm Thị D",
    },
  ]

  const handleAddTransaction = () => {
    // Xử lý thêm giao dịch mới
    setIsAddingTransaction(false)
  }

  // Lọc danh sách giao dịch theo từ khóa tìm kiếm và loại giao dịch
  const filteredTransactions = transactions.filter(
    (transaction) =>
      (transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (transactionType === null || transaction.type === transactionType),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Giao dịch nhập xuất kho</CardTitle>
          <CardDescription>Quản lý các giao dịch nhập xuất kho</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm giao dịch..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Lọc giao dịch</h4>
                  <p className="text-sm text-muted-foreground">Chọn các điều kiện lọc giao dịch</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="type">Loại giao dịch</Label>
                    <Select value={transactionType || ""} onValueChange={(value) => setTransactionType(value || null)}>
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tất cả</SelectItem>
                        <SelectItem value="Nhập kho">Nhập kho</SelectItem>
                        <SelectItem value="Xuất kho">Xuất kho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm giao dịch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Thêm giao dịch mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho giao dịch nhập xuất kho</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Loại giao dịch
                  </Label>
                  <Select defaultValue="Nhập kho" value="Nhập kho">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại giao dịch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nhập kho">Nhập kho</SelectItem>
                      <SelectItem value="Xuất kho">Xuất kho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="item" className="text-right">
                    Vật tư
                  </Label>
                  <Select defaultValue="VL001" value="VL001">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn vật tư" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VL001">VL001 - Xi măng PCB40</SelectItem>
                      <SelectItem value="VL002">VL002 - Cát xây dựng</SelectItem>
                      <SelectItem value="VL003">VL003 - Thép xây dựng Φ10</SelectItem>
                      <SelectItem value="VL004">VL004 - Gạch ốp lát 60x60</SelectItem>
                      <SelectItem value="TB001">TB001 - Dây điện 2x1.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Số lượng
                  </Label>
                  <Input id="quantity" type="number" placeholder="Nhập số lượng" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unitPrice" className="text-right">
                    Đơn giá
                  </Label>
                  <Input id="unitPrice" type="number" placeholder="Nhập đơn giá" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reference" className="text-right">
                    Số tham chiếu
                  </Label>
                  <Input id="reference" placeholder="Nhập số tham chiếu" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Nhà cung cấp
                  </Label>
                  <Select defaultValue="Công ty TNHH Vật liệu XD ABC" value="Công ty TNHH Vật liệu XD ABC">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn nhà cung cấp (nếu nhập kho)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Công ty TNHH Vật liệu XD ABC">Công ty TNHH Vật liệu XD ABC</SelectItem>
                      <SelectItem value="Công ty CP Thiết bị XD XYZ">Công ty CP Thiết bị XD XYZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="project" className="text-right">
                    Dự án
                  </Label>
                  <Select defaultValue="Chung cư ABC" value="Chung cư ABC">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn dự án (nếu xuất kho)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chung cư ABC">Chung cư ABC</SelectItem>
                      <SelectItem value="Biệt thự XYZ">Biệt thự XYZ</SelectItem>
                      <SelectItem value="Nhà máy DEF">Nhà máy DEF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="transactionDate" className="text-right">
                    Ngày giao dịch
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !transactionDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transactionDate ? (
                            format(transactionDate, "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={transactionDate} onSelect={setTransactionDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Ghi chú
                  </Label>
                  <Textarea id="notes" placeholder="Nhập ghi chú" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTransaction(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddTransaction}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loại</TableHead>
              <TableHead>Mã vật tư</TableHead>
              <TableHead>Tên vật tư</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Thành tiền</TableHead>
              <TableHead>Ngày giao dịch</TableHead>
              <TableHead>Số tham chiếu</TableHead>
              <TableHead>Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Badge
                    className={
                      transaction.type === "Nhập kho" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }
                  >
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.itemCode}</TableCell>
                <TableCell>{transaction.itemName}</TableCell>
                <TableCell>
                  {transaction.quantity} {transaction.unit}
                </TableCell>
                <TableCell>{formatCurrency(transaction.unitPrice)}</TableCell>
                <TableCell>{formatCurrency(transaction.totalPrice)}</TableCell>
                <TableCell>{new Date(transaction.date).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{transaction.referenceNumber}</TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={transaction.notes}>
                    {transaction.notes}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
