"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { signIn } from "@/lib/auth"

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    phone: "",
  })

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username: loginData.username,
        password: loginData.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Đăng nhập thất bại",
          description: "Tên đăng nhập hoặc mật khẩu không đúng",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn quay trở lại",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Đã xảy ra lỗi khi đăng nhập",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Đăng ký thất bại",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Đăng ký thất bại")
      }

      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập với tài khoản mới của bạn",
      })

      // Switch to login tab
      setActiveTab("login")
      setLoginData({
        username: registerData.username,
        password: "",
      })
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi đăng ký",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Đăng nhập</TabsTrigger>
          <TabsTrigger value="register">Đăng ký</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit}>
            <CardHeader>
              <CardTitle>Đăng nhập</CardTitle>
              <CardDescription>Nhập thông tin đăng nhập để truy cập hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">Tên đăng nhập</Label>
                <Input
                  id="login-username"
                  placeholder="Nhập tên đăng nhập"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Mật khẩu</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleRegisterSubmit}>
            <CardHeader>
              <CardTitle>Đăng ký</CardTitle>
              <CardDescription>Tạo tài khoản mới để truy cập hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-username">Tên đăng nhập</Label>
                <Input
                  id="register-username"
                  placeholder="Nhập tên đăng nhập"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-name">Họ và tên</Label>
                <Input
                  id="register-name"
                  placeholder="Nhập họ và tên"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Nhập email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-phone">Số điện thoại</Label>
                <Input
                  id="register-phone"
                  placeholder="Nhập số điện thoại"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mật khẩu</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
