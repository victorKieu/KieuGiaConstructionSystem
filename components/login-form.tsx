"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, LockKeyhole } from "lucide-react"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Kiểm tra thông tin đăng nhập đơn giản
    if (username === "admin" && password === "password") {
      // Chuyển hướng trực tiếp đến trang dashboard
      router.push("/dashboard")
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng")
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 border-gray-300"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <div className="relative">
            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 border-gray-300"
              required
            />
          </div>
        </div>
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        <Button type="submit" className="w-full bg-[#d5a95e] hover:bg-[#c69a50] text-white" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
        </Button>
      </form>
    </div>
  )
}
