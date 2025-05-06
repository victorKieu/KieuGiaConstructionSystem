import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Building,
  Landmark,
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  FileText,
  Edit,
  ArrowLeft,
  Clock,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getCustomerById, getCustomerContacts, getCustomerProjects } from "@/lib/actions/customer-actions"
import { formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const customerResult = await getCustomerById(params.id)
  const customer = customerResult.success ? customerResult.data : null

  if (!customer) {
    return {
      title: "Khách hàng không tồn tại",
      description: "Không tìm thấy thông tin khách hàng",
    }
  }

  return {
    title: `${customer.name} - Chi tiết khách hàng`,
    description: `Thông tin chi tiết về khách hàng ${customer.name}`,
  }
}

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customerResult = await getCustomerById(params.id)
  const customer = customerResult.success ? customerResult.data : null

  if (!customer) {
    notFound()
  }

  // Lấy danh sách liên hệ của khách hàng
  const contactsResult = await getCustomerContacts(params.id)
  const contacts = contactsResult.success ? contactsResult.data : []

  // Lấy danh sách dự án của khách hàng
  const projectsResult = await getCustomerProjects(params.id)
  const projects = projectsResult.success ? projectsResult.data : []

  // Lấy icon cho loại khách hàng
  const getTypeIcon = (type: string) => {
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

  // Lấy badge cho trạng thái dự án
  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return <Badge className="bg-blue-100 text-blue-800">Lập kế hoạch</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">Đang thực hiện</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case "on_hold":
        return <Badge className="bg-orange-100 text-orange-800">Tạm dừng</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
              <span className="text-muted-foreground">Mã KH: {customer.code}</span>
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/customers/${params.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
          <TabsTrigger value="projects">Dự án</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
                <CardDescription>Thông tin cơ bản về khách hàng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(customer.type)}
                    <span className="font-medium">Loại khách hàng</span>
                  </div>
                  <span>{getTypeName(customer.type)}</span>
                </div>
                <Separator />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      Trạng thái
                    </Badge>
                  </div>
                  <div>{getStatusBadge(customer.status)}</div>
                </div>
                <Separator />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Số điện thoại</span>
                  </div>
                  <span>{customer.phone}</span>
                </div>
                <Separator />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email</span>
                  </div>
                  <span>{customer.email}</span>
                </div>
                <Separator />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Địa chỉ</span>
                  </div>
                  <span className="text-right max-w-[250px]">{customer.address}</span>
                </div>
                <Separator />

                {customer.taxCode && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Mã số thuế</span>
                      </div>
                      <span>{customer.taxCode}</span>
                    </div>
                    <Separator />
                  </>
                )}

                {customer.website && (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Website</span>
                      </div>
                      <a
                        href={customer.website.startsWith("http") ? customer.website : `https://${customer.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {customer.website}
                      </a>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Ngày tạo</span>
                  </div>
                  <span>{formatDate(customer.createdAt)}</span>
                </div>
                <Separator />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Cập nhật lần cuối</span>
                  </div>
                  <span>{formatDate(customer.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
                <CardDescription>Thông tin mô tả về khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{customer.description || "Không có mô tả"}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tổng quan dự án</CardTitle>
                <CardDescription>Thống kê dự án của khách hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-blue-700">Tổng số dự án</h3>
                    <p className="text-3xl font-bold">{projects.length}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-yellow-700">Đang thực hiện</h3>
                    <p className="text-3xl font-bold">
                      {projects.filter((project) => project.status === "in_progress").length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-700">Hoàn thành</h3>
                    <p className="text-3xl font-bold">
                      {projects.filter((project) => project.status === "completed").length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-red-700">Đã hủy/Tạm dừng</h3>
                    <p className="text-3xl font-bold">
                      {
                        projects.filter((project) => project.status === "cancelled" || project.status === "on_hold")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách liên hệ</CardTitle>
                <CardDescription>Danh sách người liên hệ của khách hàng</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/customers/${params.id}/contacts/new`}>Thêm liên hệ</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {contacts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{contact.name}</CardTitle>
                            <CardDescription>{contact.position}</CardDescription>
                          </div>
                          {contact.isPrimary && <Badge className="bg-blue-100 text-blue-800">Chính</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{contact.email}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/customers/${params.id}/contacts/${contact.id}/edit`}>
                            <Edit className="mr-2 h-3 w-3" /> Sửa
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Chưa có thông tin liên hệ nào.</p>
                  <Button className="mt-4" asChild>
                    <Link href={`/dashboard/customers/${params.id}/contacts/new`}>Thêm liên hệ mới</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách dự án</CardTitle>
                <CardDescription>Các dự án của khách hàng</CardDescription>
              </div>
              <Button asChild>
                <Link href={`/dashboard/projects/new?customerId=${params.id}`}>Thêm dự án</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projects.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Mã dự án</th>
                        <th className="py-3 px-4 text-left font-medium">Tên dự án</th>
                        <th className="py-3 px-4 text-left font-medium">Trạng thái</th>
                        <th className="py-3 px-4 text-left font-medium">Ngày bắt đầu</th>
                        <th className="py-3 px-4 text-left font-medium">Ngày kết thúc</th>
                        <th className="py-3 px-4 text-right font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b">
                          <td className="py-3 px-4">{project.code}</td>
                          <td className="py-3 px-4 font-medium">{project.name}</td>
                          <td className="py-3 px-4">{getProjectStatusBadge(project.status)}</td>
                          <td className="py-3 px-4">{formatDate(project.startDate)}</td>
                          <td className="py-3 px-4">{formatDate(project.endDate)}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/projects/${project.id}`}>Xem chi tiết</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Khách hàng chưa có dự án nào.</p>
                  <Button className="mt-4" asChild>
                    <Link href={`/dashboard/projects/new?customerId=${params.id}`}>Tạo dự án mới</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>Lịch sử giao dịch với khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Chưa có giao dịch nào.</p>
                <Button className="mt-4" asChild>
                  <Link href={`/dashboard/finance/transactions/new?customerId=${params.id}`}>Tạo giao dịch mới</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
