import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserPlus,
  UserMinus,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getEmployeeStats, getNewestEmployees } from "@/lib/actions/employee-actions"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export const metadata: Metadata = {
  title: "HRM Dashboard | Kieu Gia Construction",
  description: "Tổng quan về quản lý nhân sự",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HRMDashboard() {
  console.log("🔄 Đang render trang HRM Dashboard...")

  // Lấy dữ liệu thống kê từ database
  let stats = null
  let newEmployees = []
  let error = null

  try {
    // Lấy thống kê nhân viên
    stats = await getEmployeeStats()
    console.log("📊 Đã lấy thống kê nhân viên:", stats)

    // Lấy danh sách nhân viên mới nhất
    newEmployees = await getNewestEmployees(4)
    console.log("👥 Đã lấy danh sách nhân viên mới nhất:", newEmployees.length)
  } catch (err) {
    console.error("❌ Lỗi khi lấy dữ liệu:", err)
    error = err instanceof Error ? err.message : "Không thể lấy dữ liệu từ server"
  }

  // Dữ liệu thống kê
  const statsData = [
    {
      title: "Tổng nhân viên",
      value: stats ? stats.totalEmployees.toString() : "0",
      icon: Users,
      change: "+5%",
      trend: "up",
      description: "so với tháng trước",
    },
    {
      title: "Tỷ lệ chuyên cần",
      value: "94.2%",
      icon: Clock,
      change: "+1.2%",
      trend: "up",
      description: "so với tháng trước",
    },
    {
      title: "Nhân viên mới",
      value: stats ? stats.newEmployees.toString() : "0",
      icon: UserPlus,
      change: "+3",
      trend: "up",
      description: "trong tháng này",
    },
    {
      title: "Nghỉ việc",
      value: stats ? stats.terminatedEmployees.toString() : "0",
      icon: UserMinus,
      change: "-2",
      trend: "down",
      description: "so với tháng trước",
    },
    {
      title: "Tổng chi phí lương",
      value: "1.24 tỷ",
      icon: DollarSign,
      change: "+8.5%",
      trend: "up",
      description: "so với tháng trước",
    },
    {
      title: "Tài sản đã cấp",
      value: "342",
      icon: Laptop,
      change: "+12",
      trend: "up",
      description: "trong tháng này",
    },
  ]

  // Dữ liệu chấm công hôm nay (vẫn sử dụng dữ liệu mẫu vì chưa có bảng chấm công)
  const todayAttendance = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      status: "Đã chấm công",
      time: "07:45",
      avatar: "/abstract-geometric-shapes.png",
      initials: "NA",
      statusType: "present",
    },
    {
      id: 2,
      name: "Trần Thị B",
      status: "Đã chấm công",
      time: "07:55",
      avatar: "/abstract-geometric-tb.png",
      initials: "TB",
      statusType: "present",
    },
    {
      id: 3,
      name: "Lê Văn C",
      status: "Đi muộn",
      time: "08:30",
      avatar: "/stylized-lc.png",
      initials: "LC",
      statusType: "late",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      status: "Nghỉ phép",
      time: "-",
      avatar: "/public-domain-symbol.png",
      initials: "PD",
      statusType: "leave",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      status: "Vắng mặt",
      time: "-",
      avatar: "/the-element-helium.png",
      initials: "HE",
      statusType: "absent",
    },
  ]

  // Hàm lấy chữ cái đầu của họ và tên
  const getInitials = (name: string): string => {
    if (!name) return "NA"

    const parts = name.split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">HRM Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về quản lý nhân sự</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Thẻ thống kê */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statsData.map((stat, index) => {
              const Icon = stat.icon
              const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
              const trendColor =
                stat.trend === "up"
                  ? stat.title === "Nghỉ việc"
                    ? "text-red-500"
                    : "text-green-500"
                  : stat.title === "Nghỉ việc"
                    ? "text-green-500"
                    : "text-red-500"

              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <TrendIcon className={`h-3 w-3 mr-1 ${trendColor}`} />
                      <span className={trendColor}>{stat.change}</span>
                      <span className="ml-1">{stat.description}</span>
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Hoạt động gần đây */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Các hoạt động liên quan đến nhân sự</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats && stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user.name}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Không có hoạt động gần đây.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Xem tất cả hoạt động
                </Button>
              </CardFooter>
            </Card>

            {/* Nhân viên mới */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Nhân viên mới</CardTitle>
                <CardDescription>Nhân viên mới tham gia trong tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newEmployees.length > 0 ? (
                    newEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar_url || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.position}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>{employee.department}</p>
                          <p>{employee.hire_date ? format(new Date(employee.hire_date), "dd/MM/yyyy") : "N/A"}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Không có nhân viên mới.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Link href="/dashboard/hrm/employees">Xem tất cả nhân viên</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats ? stats.totalEmployees : 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã chấm công</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">112</div>
                <p className="text-xs text-muted-foreground mt-1">90.3% tổng nhân viên</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đi muộn</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">6.5% tổng nhân viên</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vắng mặt</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">3.2% tổng nhân viên</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chấm công hôm nay</CardTitle>
              <CardDescription>Ngày: {new Date().toLocaleDateString("vi-VN")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAttendance.map((employee) => (
                  <div key={employee.id} className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback>{employee.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.time}</p>
                    </div>
                    <Badge
                      variant={
                        employee.statusType === "present"
                          ? "default"
                          : employee.statusType === "late"
                            ? "outline"
                            : employee.statusType === "leave"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Xem tất cả</Button>
              <Button>
                <Link href="/dashboard/hrm/attendance">Chấm công</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách nhân viên</CardTitle>
                <CardDescription>Tổng số: {stats ? stats.totalEmployees : 0} nhân viên</CardDescription>
              </div>
              <Button>
                <Link href="/dashboard/hrm/employees">Xem tất cả</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newEmployees.length > 0 ? (
                  newEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center gap-4 p-2 hover:bg-muted rounded-md">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar_url || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>{employee.department}</p>
                        <p>{employee.hire_date ? format(new Date(employee.hire_date), "dd/MM/yyyy") : "N/A"}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Link href={`/dashboard/hrm/employees/${employee.id}`}>Chi tiết</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Không có nhân viên nào.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
