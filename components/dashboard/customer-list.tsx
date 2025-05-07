"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
  Building,
  User,
  Landmark,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { deleteCustomer } from "@/lib/actions/customer-actions"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"

export function CustomerList({ customers = [] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<{ id: string; name: string } | null>(null)

  // Xử lý xóa khách hàng
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return

    try {
      const result = await deleteCustomer(customerToDelete.id)

      if (result.success) {
        toast({
          title: "Xóa khách hàng thành công",
          description: `Đã xóa khách hàng "${customerToDelete.name}" khỏi hệ thống.`,
        })
        router.refresh()
      } else {
        toast({
          title: "Lỗi khi xóa khách hàng",
          description: result.error || "Đã xảy ra lỗi khi xóa khách hàng.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Lỗi khi xóa khách hàng",
        description: "Đã xảy ra lỗi khi xóa khách hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    }
  }

  // Lọc và sắp xếp danh sách khách hàng
  const filteredCustomers = customers
    .filter((customer) => {
      // Lọc theo từ khóa tìm kiếm
      const searchMatch =
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())

      // Lọc theo loại khách hàng
      const typeMatch = typeFilter === "all" || customer.type === typeFilter

      // Lọc theo trạng thái
      const statusMatch = statusFilter === "all" || customer.status === statusFilter

      return searchMatch && typeMatch && statusMatch
    })
    .sort((a, b) => {
      // Sắp xếp theo trường đã chọn
      const fieldA = a[sortField] || ""
      const fieldB = b[sortField] || ""

      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
      }

      return sortDirection === "asc" ? (fieldA > fieldB ? 1 : -1) : fieldA < fieldB ? 1 : -1
    })

  // Xử lý sắp xếp
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Lấy icon cho loại khách hàng
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building className="h-4 w-4 text-blue-500" />
      case "individual":
        return <User className="h-4 w-4 text-green-500" />
      case "government":
        return <Landmark className="h-4 w-4 text-purple-500" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  // Lấy tên hiển thị cho loại khách hàng
  const getTypeName = (type: string) => {
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

  // Lấy badge cho trạng thái khách hàng
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Đang hợp tác</Badge>
      case "potential":
        return <Badge className="bg-blue-100 text-blue-800">Tiềm năng</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Ngừng hợp tác</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Danh sách khách hàng</CardTitle>
        <CardDescription>Quản lý thông tin khách hàng của công ty</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center py-4 gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Loại khách hàng <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Lọc theo loại</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={typeFilter === "all"} onCheckedChange={() => setTypeFilter("all")}>
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilter === "company"}
                onCheckedChange={() => setTypeFilter("company")}
              >
                Doanh nghiệp
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilter === "individual"}
                onCheckedChange={() => setTypeFilter("individual")}
              >
                Cá nhân
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={typeFilter === "government"}
                onCheckedChange={() => setTypeFilter("government")}
              >
                Cơ quan nhà nước
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Trạng thái <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={statusFilter === "all"} onCheckedChange={() => setStatusFilter("all")}>
                Tất cả
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "active"}
                onCheckedChange={() => setStatusFilter("active")}
              >
                Đang hợp tác
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "potential"}
                onCheckedChange={() => setStatusFilter("potential")}
              >
                Tiềm năng
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "inactive"}
                onCheckedChange={() => setStatusFilter("inactive")}
              >
                Ngừng hợp tác
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã KH</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Tên khách hàng
                    {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.code}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(customer.type)}
                        <span>{getTypeName(customer.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[200px]">{customer.address}</span>
                      </div>
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
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
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
                            onClick={() => {
                              setCustomerToDelete({ id: customer.id, name: customer.name })
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Không tìm thấy khách hàng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa khách hàng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Khách hàng "{customerToDelete?.name}" sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-red-600 hover:bg-red-700">
              Xóa khách hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
