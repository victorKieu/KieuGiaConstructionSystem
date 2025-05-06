"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CustomerFormData } from "@/lib/actions/customer-actions"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên khách hàng phải có ít nhất 2 ký tự" }),
  type: z.string().min(1, { message: "Vui lòng chọn loại khách hàng" }),
  contact_person: z.string().min(2, { message: "Tên người liên hệ phải có ít nhất 2 ký tự" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
  tax_code: z.string().optional(),
  notes: z.string().optional(),
  code: z.string().optional(),
})

type CustomerFormProps = {
  initialData?: CustomerFormData
  onSubmit: (data: CustomerFormData) => Promise<void>
  isEditing?: boolean
}

export function CustomerForm({ initialData, onSubmit, isEditing = false }: CustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      tax_code: "",
      notes: "",
      code: "",
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      toast({
        title: "Đang xử lý",
        description: isEditing ? "Đang cập nhật thông tin khách hàng..." : "Đang tạo khách hàng mới...",
      })

      await onSubmit(values as CustomerFormData)

      toast({
        title: "Thành công",
        description: isEditing ? "Cập nhật thông tin khách hàng thành công" : "Tạo khách hàng mới thành công",
      })

      router.push("/dashboard/customers")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi xử lý yêu cầu",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/customers" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{isEditing ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khách hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên khách hàng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại khách hàng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại khách hàng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Cá nhân</SelectItem>
                      <SelectItem value="company">Doanh nghiệp</SelectItem>
                      <SelectItem value="government">Cơ quan nhà nước</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người liên hệ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người liên hệ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã số thuế</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã số thuế (nếu có)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã khách hàng</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã khách hàng (nếu có)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập địa chỉ khách hàng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập ghi chú (nếu có)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard/customers")}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
