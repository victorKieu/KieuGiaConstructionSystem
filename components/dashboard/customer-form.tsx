"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type CustomerFormData, createCustomer, updateCustomer, getCustomerById } from "@/lib/actions/customer-actions"
import { useToast } from "@/components/ui/use-toast"

// Định nghĩa schema validation
const customerSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
  phone: z.string().min(10, { message: "Số điện thoại phải có ít nhất 10 số" }),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
  tax_code: z.string().optional().or(z.literal("")),
  representative: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

type CustomerFormProps = {
  customerId?: string
}

export function CustomerForm({ customerId }: CustomerFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!customerId)

  // Khởi tạo form với giá trị mặc định
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      tax_code: "",
      representative: "",
      position: "",
      notes: "",
    },
  })

  // Lấy dữ liệu khách hàng nếu đang ở chế độ sửa
  useEffect(() => {
    async function loadCustomer() {
      if (customerId) {
        try {
          setInitialLoading(true)
          const result = await getCustomerById(customerId)

          if (result.error) {
            toast({
              title: "Lỗi",
              description: `Không thể tải thông tin khách hàng: ${result.error}`,
              variant: "destructive",
            })
            return
          }

          if (result.data) {
            // Cập nhật giá trị form từ dữ liệu lấy được
            form.reset({
              name: result.data.name || "",
              email: result.data.email || "",
              phone: result.data.phone || "",
              address: result.data.address || "",
              tax_code: result.data.tax_code || "",
              representative: result.data.representative || "",
              position: result.data.position || "",
              notes: result.data.notes || "",
            })
          }
        } catch (error) {
          console.error("Error loading customer:", error)
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin khách hàng",
            variant: "destructive",
          })
        } finally {
          setInitialLoading(false)
        }
      }
    }

    loadCustomer()
  }, [customerId, form, toast])

  // Xử lý submit form
  async function onSubmit(values: z.infer<typeof customerSchema>) {
    setIsLoading(true)

    try {
      const formData: CustomerFormData = {
        name: values.name,
        email: values.email || "",
        phone: values.phone,
        address: values.address,
        tax_code: values.tax_code,
        representative: values.representative,
        position: values.position,
        notes: values.notes,
      }

      let result

      if (customerId) {
        // Cập nhật khách hàng
        result = await updateCustomer(customerId, formData)
      } else {
        // Tạo khách hàng mới
        result = await createCustomer(formData)
      }

      if (result.error) {
        toast({
          title: "Lỗi",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Thành công",
        description: customerId ? "Cập nhật khách hàng thành công" : "Tạo khách hàng mới thành công",
      })

      // Chuyển hướng về trang danh sách khách hàng
      router.push("/dashboard/customers")
      router.refresh()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xử lý yêu cầu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <CardTitle>{customerId ? "Cập nhật khách hàng" : "Thêm khách hàng mới"}</CardTitle>
      </CardHeader>
      <CardContent>
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên khách hàng *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên khách hàng" {...field} />
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
                        <Input placeholder="Nhập email" {...field} />
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
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
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
                        <Input placeholder="Nhập mã số thuế" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="representative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Người đại diện</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên người đại diện" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức vụ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập chức vụ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập ghi chú" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {customerId ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
