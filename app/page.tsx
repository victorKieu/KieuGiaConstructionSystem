import { redirect } from "next/navigation"

export default function HomePage() {
  // Chuyển hướng người dùng đến trang đăng nhập
  redirect("/login")

  // Phần code bên dưới sẽ không được thực thi do redirect
  return null
}
