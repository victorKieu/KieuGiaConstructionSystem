import { redirect } from "next/navigation"

// Đảm bảo trang luôn được render động
export const dynamic = "force-dynamic"

export default function HomePage() {
  // Chuyển hướng người dùng đến trang đăng nhập
  redirect("/login")
}
