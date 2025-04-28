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
import { Building, Edit, Mail, Phone, Plus, Search, Trash } from "lucide-react"

export default function InventorySuppliers() {
  const [isAddingSupplier, setIsAddingSupplier] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const suppliers = [
    {
      id: 1,
      name: "Công ty TNHH Vật liệu XD ABC",
      contactPerson: "Nguyễn Văn M",
      phone: "0909123460",
      email: "contact@vlxdabc.com",
      address: "123 Đường D, Quận 4, TP.HCM",
      taxCode: "1122334455",
      bankAccount: "0123456789",
      bankName: "Vietcombank",
      status: "Hoạt động",
    },
    {
      id: 2,
      name: "Công ty CP Thiết bị XD XYZ",
      contactPerson: "Trần Thị N",
      phone: "0909123461",
      email: "contact@tbxdxyz.com",
      address: "456 Đường E, Quận 5, TP.HCM",
      taxCode: "5544332211",
      bankAccount: "9876543210",
      bankName: "BIDV",
      status: "Hoạt động",
    },
    {
      id: 3,
      name: "Công ty TNHH Thép Việt",
      contactPerson: "Lê Văn P",
      phone: "0909123462",
      email: "contact@thepviet.com",
      address: "789 Đường F, Quận 6, TP.HCM",
      taxCode: "6677889900",
      bankAccount: "1357924680",
      bankName: "Agribank",
      status: "Tạm ngưng",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-100 text-green-800"
      case "Tạm ngưng":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddSupplier = () => {
    // Xử lý thêm nhà cung cấp mới
    setIsAddingSupplier(false)
  }

  // Lọc danh sách nhà cung cấp theo từ khóa tìm kiếm
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Nhà cung cấp</CardTitle>
          <CardDescription>Quản lý thông tin nhà cung cấp</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Tìm kiếm nhà cung cấp..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddingSupplier} onOpenChange={setIsAddingSupplier}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhà cung cấp
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
                <DialogDescription>Nhập thông tin chi tiết cho nhà cung cấp mới</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên nhà cung cấp
                  </Label>
                  <Input id="name" placeholder="Nhập tên nhà cung cấp" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPerson" className="text-right">
                    Người liên hệ
                  </Label>
                  <Input id="contactPerson" placeholder="Nhập tên người liên hệ" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Số điện thoại
                  </Label>
                  <Input id="phone" placeholder="Nhập số điện thoại" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" placeholder="Nhập email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Địa chỉ
                  </Label>
                  <Textarea id="address" placeholder="Nhập địa chỉ" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="taxCode" className="text-right">
                    Mã số thuế
                  </Label>
                  <Input id="taxCode" placeholder="Nhập mã số thuế" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bankAccount" className="text-right">
                    Số tài khoản
                  </Label>
                  <Input id="bankAccount" placeholder="Nhập số tài khoản" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bankName" className="text-right">
                    Ngân hàng
                  </Label>
                  <Input id="bankName" placeholder="Nhập tên ngân hàng" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSupplier(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddSupplier}>Lưu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên nhà cung cấp</TableHead>
              <TableHead>Người liên hệ</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Mã số thuế</TableHead>
              <TableHead>Tài khoản</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <Phone className="mr-1 h-3 w-3" />
                      <span className="text-sm">{supplier.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      <span className="text-sm">{supplier.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building className="mr-1 h-3 w-3" />
                    <span className="text-sm">{supplier.address}</span>
                  </div>
                </TableCell>
                <TableCell>{supplier.taxCode}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{supplier.bankAccount}</div>
                    <div className="text-xs text-gray-500">{supplier.bankName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(supplier.status)}>{supplier.status}</Badge>
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
