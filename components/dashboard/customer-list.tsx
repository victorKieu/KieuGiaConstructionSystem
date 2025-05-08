"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building, Edit, Eye, Landmark, MoreHorizontal, Search, Trash2, User } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
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
import { Badge } from "@/components/ui/badge"
import { deleteCustomer } from "@/lib/actions/customer-actions"
import { toast } from "@/components/ui/use-toast"
import type { Customer } from "@/types/customer"

// Hàm lấy biểu tượng dựa trên loại khách hàng
function getCustomerTypeIcon(type) {
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

// Hàm lấy tên loại khách hàng
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

// Hàm lấy badge trạng thái
function getStatusBadge(status) {
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

export function CustomerList({ customers = [] }: { customers: Customer[] }) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter((customer) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(searchTermLower) ||
      customer.code?.toLowerCase().includes(searchTermLower) ||
      customer.email?.toLowerCase().includes(searchTermLower) ||
      customer.phone?.toString().includes(searchTerm) ||
      customer.contact_person?.toLowerCase().includes(searchTermLower)
    )
  })

  // Xử lý xóa khách hàng
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteCustomer(customerToDelete.id)
      if (result.success) {
        toast({
          title: "Xóa thành công",
          description: `Đã xóa khách hàng "${customerToDelete.name}"`,
        })
        router.refresh()
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Không thể xóa khách hàng",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xóa khách hàng",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setCustomerToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Mã KH</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Người liên hệ</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không tìm thấy khách hàng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.code || "-"}</TableCell>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    {customer.created_at && (
                      <div className="text-xs text-muted-foreground">
                        Ngày tạo: {format(new Date(customer.created_at), "dd/MM/yyyy")}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getCustomerTypeIcon(customer.type)}
                      <span className="ml-2">{getCustomerTypeName(customer.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.contact_person && <div className="font-medium">{customer.contact_person}</div>}
                    {customer.position && <div className="text-xs text-muted-foreground">{customer.position}</div>}
                  </TableCell>
                  <TableCell>
                    {customer.phone && <div>{customer.phone}</div>}
                    {customer.email && <div className="text-xs text-muted-foreground">{customer.email}</div>}
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
                        <DropdownMenuItem className="text-red-600" onClick={() => setCustomerToDelete(customer)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog xác nhận xóa khách hàng */}
      <AlertDialog open={!!customerToDelete} onOpenChange={(open) => !open && setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng "{customerToDelete?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteCustomer()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
