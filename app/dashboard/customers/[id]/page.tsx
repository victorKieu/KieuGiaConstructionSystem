import { notFound } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { Building, Calendar, Edit, Globe, Landmark, Mail, MapPin, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCustomerById } from "@/lib/actions/customer-actions"

export const metadata = {
  title: "Chi tiết khách hàng",
  description: "Xem thông tin chi tiết khách hàng",
}

// Hàm lấy biểu tượng dựa trên loại khách hàng
function getCustomerTypeIcon(type) {
  switch (type) {
    case "company":
      return <Building className="h-5 w-5 text-blue-500" />
    case "individual":
      return <User className="h-5 w-5 text-green-500" />
    case "government":
      return <Landmark className="h-5 w-5 text-purple-500" />
    default:
      return <Building className="h-5 w-5" />
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
      return <Badge variant="success">Đang hợp tác</Badge>
    case "potential":
      return <Badge variant="warning">Tiềm năng</Badge>
    case "inactive":
      return <Badge variant="destructive">Ngừng hợp tác</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

export default async function CustomerDetailPage({ params }) {
  const { id } = params
  const result = await getCustomerById(id)

  if (!result.success || !result.data) {
    notFound()
  }

  const customer = result.data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-muted-foreground">
              {getCustomerTypeIcon(customer.type)}
              <span className="ml-1">{getCustomerTypeName(customer.type)}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center text-muted-foreground">
              <span>Mã: {customer.code}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            {getStatusBadge(customer.status)}
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/customers/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
            <CardDescription>Thông tin liên hệ của khách hàng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.phone && (
              <div className="flex items-start">
                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Số điện thoại</div>
                  <div>{customer.phone}</div>
                </div>
              </div>
            )}
            {customer.email && (
              <div className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email</div>
                  <div>{customer.email}</div>
                </div>
              </div>
            )}
            {customer.address && (
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Địa chỉ</div>
                  <div>{customer.address}</div>
                </div>
              </div>
            )}
            {customer.website && (
              <div className="flex items-start">
                <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Website</div>
                  <div>
                    <a
                      href={customer.website.startsWith("http") ? customer.website : `https://${customer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {customer.website}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin bổ sung</CardTitle>
            <CardDescription>Thông tin chi tiết về khách hàng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.taxCode && (
              <div className="flex items-start">
                <div className="mr-2 h-5 w-5 flex items-center justify-center text-muted-foreground">
                  <span className="text-sm font-bold">MST</span>
                </div>
                <div>
                  <div className="font-medium">Mã số thuế</div>
                  <div>{customer.taxCode}</div>
                </div>
              </div>
            )}
            {customer.createdAt && (
              <div className="flex items-start">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ngày tạo</div>
                  <div>{format(new Date(customer.createdAt), "dd/MM/yyyy")}</div>
                </div>
              </div>
            )}
            {customer.description && (
              <div className="mt-4">
                <div className="font-medium mb-1">Mô tả</div>
                <div className="text-muted-foreground whitespace-pre-line">{customer.description}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
