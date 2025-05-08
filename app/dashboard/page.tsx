import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Chuyển hướng người dùng đến trang danh sách dự án
  redirect("/dashboard/projectlist")

  // Phần code bên dưới sẽ không được thực thi do redirect
  return null
}
