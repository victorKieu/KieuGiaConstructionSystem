"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, Edit, Eye, Landmark, MoreHorizontal, Search, Trash2, User, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { deleteCustomer } from "@/lib/actions/customer-actions"

export function CustomerList({ customers = [] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Xử lý xóa khách hàng
  const handleDelete = async (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" không?`)) {
      const result = await deleteCustomer(id)
      if (result.success) {
        toast({
          title: "Xóa thành công",
          description: `Đã xóa khách hàng "${name}"`,
        })
        router.refresh()
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Không thể xóa khách hàng",
          variant: "destructive",
        })
      }
    }
  }

  // Lọc khách hàng theo tìm kiếm và bộ lọc
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || customer.type === typeFilter
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  // Lấy icon cho loại khách hàng
  const getTypeIcon = (type) => {
    switch (type) {
      case "company":
        return <Building className="h-4 w-4 text-blue-500" />
      case "individual":
        return <User className="h-4 w-4 text-green-500" />
      case "government":
        return <Landmark className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  // Lấy tên hiển thị cho loại khách hàng
  const getTypeName = (type) => {
    switch (type) {
      case "company":
        return "Doanh nghiệp"
      case "individual":
        return "Cá nhân"
      case "government":
        return "Cơ quan nhà nước"
      default:
        return type
    }
  }

  // Lấy badge cho trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang hợp tác</Badge>
      case "potential":
        return <Badge className="bg-blue-500">Tiềm năng</Badge>
      case "inactive":
        return <Badge variant="outline">Ngừng hợp tác</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách khách hàng</CardTitle>
        <CardDescription>Quản lý danh sách khách hàng và đối tác của công ty</CardDescription>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Tìm kiếm theo tên, mã, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="company">Doanh nghiệp</SelectItem>
                <SelectItem value="individual">Cá nhân</SelectItem>
                <SelectItem value="government">Cơ quan nhà nước</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hợp tác</SelectItem>
                <SelectItem value="potential">Tiềm năng</SelectItem>
                <SelectItem value="inactive">Ngừng hợp tác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCustomers.length === 0 ? (
          <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <h3 className="mt-4 text-lg font-semibold">Không tìm thấy khách hàng</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Không có khách hàng nào phù hợp với tiêu chí tìm kiếm. Vui lòng thử lại với tiêu chí khác.
              </p>
              <Button asChild>
                <Link href="/dashboard/customers/new">
                  <Plus className="mr-2 h-4 w-4" /> Thêm khách hàng mới
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getTypeIcon(customer.type)}
                        <span className="ml-2">{getTypeName(customer.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{customer.contact_person}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/customers/${customer.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/customers/${customer.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(customer.id, customer.name)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
