import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export const metadata: Metadata = {
  title: "HRM Dashboard | Kieu Gia Construction",
  description: "Tổng quan về quản lý nhân sự",
}

export default function HRMDashboard() {
  // Dữ liệu mẫu cho dashboard
  const stats = [
    {
      title: "Tổng nhân viên",
      value: "124",
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
      value: "8",
      icon: UserPlus,
      change: "+3",
      trend: "up",
      description: "trong tháng này",
    },
    {
      title: "Nghỉ việc",
      value: "3",
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

  // Dữ liệu biểu đồ phân bố nhân viên theo phòng ban
  const departmentData = [
    { name: "Kỹ thuật", value: 42 },
    { name: "Kinh doanh", value: 28 },
    { name: "Tài chính", value: 15 },
    { name: "Nhân sự", value: 10 },
    { name: "Hành chính", value: 12 },
    { name: "Dự án", value: 17 },
  ]

  // Dữ liệu biểu đồ xu hướng chuyên cần
  const attendanceData = [
    { name: "T1", attendance: 92, leave: 8 },
    { name: "T2", attendance: 93, leave: 7 },
    { name: "T3", attendance: 91, leave: 9 },
    { name: "T4", attendance: 94, leave: 6 },
    { name: "T5", attendance: 95, leave: 5 },
    { name: "T6", attendance: 93, leave: 7 },
    { name: "T7", attendance: 94, leave: 6 },
    { name: "T8", attendance: 96, leave: 4 },
    { name: "T9", attendance: 95, leave: 5 },
    { name: "T10", attendance: 94, leave: 6 },
    { name: "T11", attendance: 93, leave: 7 },
    { name: "T12", attendance: 92, leave: 8 },
  ]

  // Dữ liệu biểu đồ phân bố nhân viên theo chức vụ
  const positionData = [
    { name: "Nhân viên", value: 85 },
    { name: "Trưởng nhóm", value: 20 },
    { name: "Quản lý", value: 12 },
    { name: "Giám đốc", value: 7 },
  ]

  // Màu sắc cho biểu đồ tròn
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  // Dữ liệu hoạt động gần đây
  const recentActivities = [
    {
      id: 1,
      user: {
        name: "Nguyễn Văn A",
        avatar: "/abstract-geometric-shapes.png",
        initials: "NA",
      },
      action: "đã được thêm vào hệ thống",
      time: "2 giờ trước",
    },
    {
      id: 2,
      user: {
        name: "Trần Thị B",
        avatar: "/abstract-geometric-tb.png",
        initials: "TB",
      },
      action: "đã cập nhật thông tin cá nhân",
      time: "3 giờ trước",
    },
    {
      id: 3,
      user: {
        name: "Lê Văn C",
        avatar: "/stylized-lc.png",
        initials: "LC",
      },
      action: "đã được thăng chức lên Trưởng nhóm",
      time: "5 giờ trước",
    },
    {
      id: 4,
      user: {
        name: "Phạm Thị D",
        avatar: "/public-domain-symbol.png",
        initials: "PD",
      },
      action: "đã được cấp laptop mới",
      time: "1 ngày trước",
    },
    {
      id: 5,
      user: {
        name: "Hoàng Văn E",
        avatar: "/the-element-helium.png",
        initials: "HE",
      },
      action: "đã nghỉ phép 3 ngày",
      time: "2 ngày trước",
    },
  ]

  // Dữ liệu nhân viên mới
  const newEmployees = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Kỹ sư xây dựng",
      department: "Kỹ thuật",
      joinDate: "15/04/2023",
      avatar: "/abstract-geometric-shapes.png",
      initials: "NA",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "Chuyên viên kinh doanh",
      department: "Kinh doanh",
      joinDate: "20/04/2023",
      avatar: "/abstract-geometric-tb.png",
      initials: "TB",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Kế toán",
      department: "Tài chính",
      joinDate: "22/04/2023",
      avatar: "/stylized-lc.png",
      initials: "LC",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      position: "Nhân viên nhân sự",
      department: "Nhân sự",
      joinDate: "25/04/2023",
      avatar: "/public-domain-symbol.png",
      initials: "PD",
    },
  ]

  // Dữ liệu KPI cao nhất
  const topKPIs = [
    {
      id: 1,
      name: "Nguyễn Văn X",
      position: "Trưởng phòng kinh doanh",
      kpi: 98,
      department: "Kinh doanh",
      avatar: "/placeholder.svg?key=kkc8m",
      initials: "NX",
    },
    {
      id: 2,
      name: "Trần Thị Y",
      position: "Kỹ sư trưởng",
      kpi: 95,
      department: "Kỹ thuật",
      avatar: "/thank-you-text.png",
      initials: "TY",
    },
    {
      id: 3,
      name: "Lê Văn Z",
      position: "Chuyên viên kinh doanh",
      kpi: 92,
      department: "Kinh doanh",
      avatar: "/abstract-lz.png",
      initials: "LZ",
    },
    {
      id: 4,
      name: "Phạm Thị W",
      position: "Kỹ sư xây dựng",
      kpi: 90,
      department: "Kỹ thuật",
      avatar: "/abstract-pw.png",
      initials: "PW",
    },
  ]

  // Dữ liệu chấm công hôm nay
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

  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">HRM Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về quản lý nhân sự</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Thẻ thống kê */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => {
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Biểu đồ phân bố nhân viên theo phòng ban */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Phân bố theo phòng ban</CardTitle>
                <CardDescription>Số lượng nhân viên theo từng phòng ban</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Biểu đồ xu hướng chuyên cần */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Xu hướng chuyên cần</CardTitle>
                <CardDescription>Tỷ lệ chuyên cần theo tháng trong năm</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Chuyên cần (%)"
                    />
                    <Line type="monotone" dataKey="leave" stroke="#82ca9d" name="Nghỉ phép (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
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
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
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
                  ))}
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
                  {newEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>{employee.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <p>{employee.department}</p>
                        <p>{employee.joinDate}</p>
                      </div>
                    </div>
                  ))}
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
                <div className="text-2xl font-bold">124</div>
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

          <Card>
            <CardHeader>
              <CardTitle>Thống kê chấm công theo phòng ban</CardTitle>
              <CardDescription>Tỷ lệ chấm công theo từng phòng ban</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Kỹ thuật", present: 95, late: 3, absent: 2 },
                    { name: "Kinh doanh", present: 88, late: 8, absent: 4 },
                    { name: "Tài chính", present: 93, late: 5, absent: 2 },
                    { name: "Nhân sự", present: 100, late: 0, absent: 0 },
                    { name: "Hành chính", present: 92, late: 8, absent: 0 },
                    { name: "Dự án", present: 85, late: 10, absent: 5 },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#4ade80" name="Đúng giờ (%)" />
                  <Bar dataKey="late" fill="#facc15" name="Đi muộn (%)" />
                  <Bar dataKey="absent" fill="#f87171" name="Vắng mặt (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Biểu đồ phân bố nhân viên theo chức vụ */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Phân bố theo chức vụ</CardTitle>
                <CardDescription>Số lượng nhân viên theo từng chức vụ</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={positionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {positionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Nhân viên có KPI cao nhất */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>KPI cao nhất</CardTitle>
                <CardDescription>Nhân viên có chỉ số KPI cao nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topKPIs.map((employee) => (
                    <div key={employee.id} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>{employee.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{employee.kpi}%</p>
                        <p className="text-xs text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Link href="/dashboard/hrm/kpis">Xem tất cả KPI</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhân viên theo thâm niên</CardTitle>
              <CardDescription>Phân bố nhân viên theo số năm làm việc</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "< 1 năm", value: 28 },
                    { name: "1-2 năm", value: 35 },
                    { name: "3-5 năm", value: 42 },
                    { name: "6-10 năm", value: 15 },
                    { name: "> 10 năm", value: 4 },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Số nhân viên" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách nhân viên</CardTitle>
                <CardDescription>Tổng số: 124 nhân viên</CardDescription>
              </div>
              <Button>
                <Link href="/dashboard/hrm/employees">Xem tất cả</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                headers={["Họ tên", "Chức vụ", "Phòng ban", "Thâm niên", "Trạng thái"]}
                data={[
                  {
                    "Họ tên": (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>NVA</AvatarFallback>
                        </Avatar>
                        <span>Nguyễn Văn A</span>
                      </div>
                    ),
                    "Chức vụ": "Kỹ sư xây dựng",
                    "Phòng ban": "Kỹ thuật",
                    "Thâm niên": "2 năm",
                    "Trạng thái": <Badge>Đang làm việc</Badge>,
                  },
                  {
                    "Họ tên": (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>TTB</AvatarFallback>
                        </Avatar>
                        <span>Trần Thị B</span>
                      </div>
                    ),
                    "Chức vụ": "Trưởng phòng kinh doanh",
                    "Phòng ban": "Kinh doanh",
                    "Thâm niên": "5 năm",
                    "Trạng thái": <Badge>Đang làm việc</Badge>,
                  },
                  {
                    "Họ tên": (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>LVC</AvatarFallback>
                        </Avatar>
                        <span>Lê Văn C</span>
                      </div>
                    ),
                    "Chức vụ": "Kế toán trưởng",
                    "Phòng ban": "Tài chính",
                    "Thâm niên": "3 năm",
                    "Trạng thái": <Badge>Đang làm việc</Badge>,
                  },
                  {
                    "Họ tên": (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>PTD</AvatarFallback>
                        </Avatar>
                        <span>Phạm Thị D</span>
                      </div>
                    ),
                    "Chức vụ": "Nhân viên nhân sự",
                    "Phòng ban": "Nhân sự",
                    "Thâm niên": "1 năm",
                    "Trạng thái": <Badge variant="outline">Thử việc</Badge>,
                  },
                  {
                    "Họ tên": (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>HVE</AvatarFallback>
                        </Avatar>
                        <span>Hoàng Văn E</span>
                      </div>
                    ),
                    "Chức vụ": "Giám đốc dự án",
                    "Phòng ban": "Dự án",
                    "Thâm niên": "7 năm",
                    "Trạng thái": <Badge>Đang làm việc</Badge>,
                  },
                ]}
                keyField="Họ tên"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ giữ chân nhân viên</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500 inline" />
                  <span className="text-green-500">+2.5%</span>
                  <span className="ml-1">so với năm trước</span>
                </p>
                <Progress value={92.5} className="mt-3" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chi phí tuyển dụng</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5 triệu</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingDown className="h-3 w-3 mr-1 text-green-500 inline" />
                  <span className="text-green-500">-8.3%</span>
                  <span className="ml-1">so với năm trước</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thời gian tuyển dụng</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 ngày</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingDown className="h-3 w-3 mr-1 text-green-500 inline" />
                  <span className="text-green-500">-3 ngày</span>
                  <span className="ml-1">so với năm trước</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Biến động nhân sự theo tháng</CardTitle>
              <CardDescription>Số lượng nhân viên mới và nghỉ việc theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "T1", new: 5, leave: 2 },
                    { name: "T2", new: 3, leave: 1 },
                    { name: "T3", new: 4, leave: 2 },
                    { name: "T4", new: 8, leave: 3 },
                    { name: "T5", new: 6, leave: 2 },
                    { name: "T6", new: 5, leave: 4 },
                    { name: "T7", new: 7, leave: 3 },
                    { name: "T8", new: 9, leave: 2 },
                    { name: "T9", new: 4, leave: 1 },
                    { name: "T10", new: 3, leave: 2 },
                    { name: "T11", new: 5, leave: 3 },
                    { name: "T12", new: 4, leave: 2 },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="new" fill="#4ade80" name="Nhân viên mới" />
                  <Bar dataKey="leave" fill="#f87171" name="Nghỉ việc" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi phí nhân sự theo phòng ban</CardTitle>
              <CardDescription>Tổng chi phí lương và phúc lợi theo phòng ban (triệu VNĐ)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Kỹ thuật", salary: 420, benefit: 84 },
                    { name: "Kinh doanh", salary: 350, benefit: 70 },
                    { name: "Tài chính", salary: 180, benefit: 36 },
                    { name: "Nhân sự", salary: 120, benefit: 24 },
                    { name: "Hành chính", salary: 150, benefit: 30 },
                    { name: "Dự án", salary: 220, benefit: 44 },
                  ]}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="salary" stackId="a" fill="#8884d8" name="Lương" />
                  <Bar dataKey="benefit" stackId="a" fill="#82ca9d" name="Phúc lợi" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
