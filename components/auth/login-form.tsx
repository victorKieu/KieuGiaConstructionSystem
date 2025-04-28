"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { LockKeyhole, User } from "lucide-react"

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
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
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Đã xảy ra lỗi khi đăng nhập",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Tên đăng nhập</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input id="username" placeholder="Nhập tên đăng nhập" className="pl-10" {...register("username")} />
        </div>
        {errors.username && <p className="text-sm font-medium text-red-500">{errors.username.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            className="pl-10"
            {...register("password")}
          />
        </div>
        {errors.password && <p className="text-sm font-medium text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  )
}
