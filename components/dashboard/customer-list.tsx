"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, Edit, Eye, Landmark, MoreHorizontal, Plus, Search, Trash2, User, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { deleteCustomer } from "@/lib/actions/customer-actions"

// Hàm hiển thị icon theo loại khách hàng
function getCustomerTypeIcon(type) {
  switch (type) {
    case "company":
      return <Building className="h-4 w-4 text-blue-500" />
    case "individual":
      return <User className="h-4 w-4 text-green-500" />
    case "government":
      return <Landmark className="h-4 w-4 text-purple-500" />
    default:
      return <UserCircle className="h-4 w-4" />
  }
}

// Hàm hiển thị tên loại khách hàng
function getCustomerTypeName(type) {
  switch (type) {
    case "company":
      return "Doanh nghiệp"
    case "individual":
      return "Cá nhân"
    case "government":
      return "Cơ quan nhà nước"
    default:
      return "Không xác định"
  }
}

// Hàm hiển thị badge trạng thái
function getStatusBadge(status) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500">Đang hợp tác</Badge>
    case "potential":
      return <Badge className="bg-blue-500">Tiềm năng</Badge>
    case "inactive":
      return <Badge variant="outline">Ngừng hợp tác</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

export function CustomerList({ customers = [] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Xử lý xóa khách hàng
  const handleDelete = async (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" không?`)) {
      try {
        const result = await deleteCustomer(id)
        if (result.success) {
          toast({
            title: "Xóa thành công",
            description: `Đã xóa khách hàng "${name}"`,
          })
          router.refresh()
        } else {
          toast({
            title: "Có lỗi xảy ra",
            description: result.error || "Không thể xóa khách hàng",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Có lỗi xảy ra",
          description: "Không thể xóa khách hàng. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      }
    }
  }

  // Lọc khách hàng theo tìm kiếm và bộ lọc
  const filteredCustomers = customers.filter((customer) => {
    // Lọc theo từ khóa tìm kiếm
    const searchMatch =
      !searchTerm ||
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toString().includes(searchTerm)

    // Lọc theo loại khách hàng
    const typeMatch = filterType === "all" || customer.type === filterType

    // Lọc theo trạng thái
    const statusMatch = filterStatus === "all" || customer.status === filterStatus

    return searchMatch && typeMatch && statusMatch
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách khách hàng</CardTitle>
        <CardDescription>Quản lý thông tin khách hàng và đối tác của công ty</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm khách hàng..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Loại khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="company">Doanh nghiệp</SelectItem>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                  <SelectItem value="government">Cơ quan nhà nước</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang hợp tác</SelectItem>
                  <SelectItem value="potential">Tiềm năng</SelectItem>
                  <SelectItem value="inactive">Ngừng hợp tác</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <UserCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Không tìm thấy khách hàng</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Không tìm thấy khách hàng phù hợp với điều kiện tìm kiếm."
                  : "Bạn chưa có khách hàng nào. Hãy thêm khách hàng mới."}
              </p>
              {searchTerm || filterType !== "all" || filterStatus !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterType("all")
                    setFilterStatus("all")
                  }}
                >
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/dashboard/customers/new">
                    <Plus className="mr-2 h-4 w-4" /> Thêm khách hàng
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã khách hàng</TableHead>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Người liên hệ</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.code || "-"}</TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.address || "Chưa cập nhật địa chỉ"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getCustomerTypeIcon(customer.type)}
                          <span className="ml-2">{getCustomerTypeName(customer.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.contact_person ? (
                          <div>
                            <div>{customer.contact_person}</div>
                            {customer.position && (
                              <div className="text-sm text-muted-foreground">{customer.position}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Chưa cập nhật</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {customer.phone || customer.email ? (
                          <div>
                            {customer.phone && <div>{customer.phone}</div>}
                            {customer.email && <div className="text-sm">{customer.email}</div>}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Chưa cập nhật</span>
                        )}
                      </TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/customers/${customer.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/customers/${customer.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(customer.id, customer.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
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
        </div>
      </CardContent>
    </Card>
  )
}
