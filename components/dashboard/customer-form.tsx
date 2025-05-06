"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Building, Landmark, User, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { createCustomer, updateCustomer } from "@/lib/actions/customer-actions"

// Schema validation cho form khách hàng
const customerFormSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(2, {
    message: "Tên khách hàng phải có ít nhất 2 ký tự.",
  }),
  type: z.enum(["company", "individual", "government"], {
    required_error: "Vui lòng chọn loại khách hàng.",
  }),
  status: z.enum(["active", "potential", "inactive"], {
    required_error: "Vui lòng chọn trạng thái khách hàng.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự.",
  }),
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ.",
  }),
  address: z.string().min(5, {
    message: "Địa chỉ phải có ít nhất 5 ký tự.",
  }),
  taxCode: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

// Props cho component CustomerForm
interface CustomerFormProps {
  initialData?: any
  isEditing?: boolean
}

export function CustomerForm({ initialData, isEditing = false }: CustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Khởi tạo form với react-hook-form và zod validation
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      type: "company",
      status: "active",
      phone: "",
      email: "",
      address: "",
      taxCode: "",
      website: "",
      description: "",
    },
  })

  // Xử lý submit form
  async function onSubmit(data: CustomerFormValues) {
    setIsSubmitting(true)
    try {
      if (isEditing && initialData?.id) {
        // Cập nhật khách hàng hiện có
        const result = await updateCustomer(initialData.id, data)
        if (result.success) {
          toast({
            title: "Cập nhật thành công",
            description: `Đã cập nhật thông tin khách hàng "${data.name}".`,
          })
          router.push(`/dashboard/customers/${initialData.id}`)
          router.refresh()
        } else {
          toast({
            title: "Lỗi",
            description: result.error || "Đã xảy ra lỗi khi cập nhật khách hàng.",
            variant: "destructive",
          })
        }
      } else {
        // Tạo khách hàng mới
        const result = await createCustomer(data)
        if (result.success) {
          toast({
            title: "Tạo mới thành công",
            description: `Đã tạo khách hàng "${data.name}" thành công.`,
          })
          router.push(`/dashboard/customers/${result.data.id}`)
          router.refresh()
        } else {
          toast({
            title: "Lỗi",
            description: result.error || "Đã xảy ra lỗi khi tạo khách hàng mới.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lấy icon cho loại khách hàng
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building className="h-4 w-4" />
      case "individual":
        return <User className="h-4 w-4" />
      case "government":
        return <Landmark className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</CardTitle>
        <CardDescription>
          {isEditing ? "Cập nhật thông tin khách hàng hiện có" : "Nhập thông tin để tạo khách hàng mới trong hệ thống"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Mã khách hàng */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã khách hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tự động tạo nếu để trống"
                        {...field}
                        value={field.value || ""}
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormDescription>Mã khách hàng sẽ được tạo tự động nếu bạn để trống trường này.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tên khách hàng */}
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

              {/* Loại khách hàng */}
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
                        <SelectItem value="company">
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4" />
                            <span>Doanh nghiệp</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="individual">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Cá nhân</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="government">
                          <div className="flex items-center">
                            <Landmark className="mr-2 h-4 w-4" />
                            <span>Cơ quan nhà nước</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trạng thái */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Trạng thái</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="active" />
                          </FormControl>
                          <FormLabel className="font-normal">Đang hợp tác</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="potential" />
                          </FormControl>
                          <FormLabel className="font-normal">Tiềm năng</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="inactive" />
                          </FormControl>
                          <FormLabel className="font-normal">Ngừng hợp tác</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Số điện thoại */}
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

              {/* Email */}
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

              {/* Mã số thuế */}
              <FormField
                control={form.control}
                name="taxCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã số thuế (nếu có)" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập website (nếu có)" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Địa chỉ */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ khách hàng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mô tả */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập thông tin mô tả về khách hàng (nếu có)"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Cập nhật" : "Tạo mới"}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
