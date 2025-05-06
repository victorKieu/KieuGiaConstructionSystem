import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Building,
  User,
  Landmark,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileText,
  Calendar,
  Edit,
  ArrowLeft,
  Users,
  Briefcase,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCustomerById, getCustomerContacts, getCustomerProjects } from "@/lib/actions/customer-actions"
import { formatDate } from "@/lib/utils"

export const metadata = {
  title: "Chi tiết khách hàng",
  description: "Xem thông tin chi tiết của khách hàng",
}

export default async function CustomerDetailPage({ params }) {
  // Lấy thông tin khách hàng
  const customerResult = await getCustomerById(params.id)

  // Nếu không tìm thấy khách hàng, chuyển đến trang not found
  if (!customerResult.success) {
    notFound()
  }

  const customer = customerResult.data

  // Lấy danh sách liên hệ của khách hàng
  const contactsResult = await getCustomerContacts(params.id)
  const contacts = contactsResult.success ? contactsResult.data : []

  // Lấy danh sách dự án của khách hàng
  const projectsResult = await getCustomerProjects(params.id)
  const projects = projectsResult.success ? projectsResult.data : []

  // Lấy icon cho loại khách hàng
  const getTypeIcon = (type) => {
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

  // Lấy badge cho trạng thái khách hàng
  const getStatusBadge = (status) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {getTypeIcon(customer.type)}
                <span className="text-muted-foreground">{getTypeName(customer.type)}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Mã: {customer.code}</span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/customers/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin chung</TabsTrigger>
          <TabsTrigger value="contacts">Người liên hệ ({contacts.length})</TabsTrigger>
          <TabsTrigger value="projects">Dự án ({projects.length})</TabsTrigger>
        </TabsList>

        {/* Tab thông tin chung */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chi tiết</CardTitle>
              <CardDescription>Thông tin cơ bản về khách hàng</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Trạng thái</h3>
                  <div className="mt-1">{getStatusBadge(customer.status)}</div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Số điện thoại</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone || "Chưa cập nhật"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email || "Chưa cập nhật"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Địa chỉ</h3>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{customer.address || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Mã số thuế</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.taxCode || "Chưa cập nhật"}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {customer.website ? (
                        <a
                          href={customer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {customer.website}
                        </a>
                      ) : (
                        "Chưa cập nhật"
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ngày tạo</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(customer.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(customer.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {customer.description && (
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{customer.description}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab người liên hệ */}
        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Người liên hệ</CardTitle>
                <CardDescription>Danh sách người liên hệ của khách hàng</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/customers/${params.id}/contacts/new`}>
                  <Users className="mr-2 h-4 w-4" />
                  Thêm người liên hệ
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {contacts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {contacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.position}</p>
                          </div>
                          {contact.isPrimary && <Badge className="bg-blue-100 text-blue-800">Chính</Badge>}
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.phone || "Chưa cập nhật"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.email || "Chưa cập nhật"}</span>
                          </div>
                        </div>
                        {contact.notes && (
                          <div className="mt-2 border-t pt-2">
                            <p className="text-sm">{contact.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Chưa có người liên hệ</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Khách hàng này chưa có thông tin người liên hệ nào.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href={`/dashboard/customers/${params.id}/contacts/new`}>Thêm người liên hệ</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab dự án */}
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dự án</CardTitle>
                <CardDescription>Danh sách dự án của khách hàng</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/projects/new?customerId=${params.id}`}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Tạo dự án mới
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">{project.code}</p>
                          </div>
                          <Badge
                            className={
                              project.status === "active"
                                ? "bg-green-100 text-green-800"
                                : project.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {project.status === "active"
                              ? "Đang thực hiện"
                              : project.status === "completed"
                                ? "Hoàn thành"
                                : "Tạm dừng"}
                          </Badge>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/projects/${project.id}`}>Xem chi tiết</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Chưa có dự án</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Khách hàng này chưa có dự án nào được tạo.</p>
                  <Button className="mt-4" asChild>
                    <Link href={`/dashboard/projects/new?customerId=${params.id}`}>Tạo dự án mới</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
