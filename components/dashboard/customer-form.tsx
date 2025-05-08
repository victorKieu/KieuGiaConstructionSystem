"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building, Landmark, User, Save, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { createCustomer, updateCustomer } from "@/lib/actions/customer-actions"
import type { Customer } from "@/types/customer"

// Schema validation cho form
const customerSchema = z.object({
  code: z.string().optional().nullable(),
  name: z.string().min(2, {
    message: "Tên khách hàng phải có ít nhất 2 ký tự",
  }),
  type: z.enum(["company", "individual", "government"], {
    required_error: "Vui lòng chọn loại khách hàng",
  }),
  status: z.enum(["active", "potential", "inactive"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
  contact_person: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
  tax_code: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  sales_channel: z.string().optional().nullable(),
  geocode: z.string().optional().nullable(),
})

export function CustomerForm({ customer = null }: { customer?: Customer | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const isEditing = !!customer

  // Khởi tạo form với giá trị mặc định
  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      code: customer?.code || "",
      name: customer?.name || "",
      type: customer?.type || "company",
      status: customer?.status || "active",
      contact_person: customer?.contact_person || "",
      position: customer?.position || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      address: customer?.address || "",
      tax_code: customer?.tax_code || "",
      notes: customer?.notes || "",
      birthday: customer?.birthday || "",
      sales_channel: customer?.sales_channel || "",
      geocode: customer?.geocode || "",
    },
  })

  // Xử lý khi submit form
  async function onSubmit(values) {
    setIsSubmitting(true)
    setError(null)
    setDebugInfo(null)

    try {
      console.log("Submitting form with values:", values)

      // Chuyển đổi các giá trị rỗng thành null
      const formattedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value === "" ? null : value]),
      )

      console.log("Formatted values:", formattedValues)

      let result

      if (isEditing && customer) {
        // Cập nhật khách hàng
        console.log(`Updating customer with ID: ${customer.id}`)
        result = await updateCustomer(customer.id, formattedValues)
      } else {
        // Tạo khách hàng mới
        console.log("Creating new customer")
        result = await createCustomer(formattedValues)
      }

      console.log("Server action result:", result)
      setDebugInfo(result)

      if (result.success) {
        toast({
          title: isEditing ? "Cập nhật thành công" : "Tạo mới thành công",
          description: isEditing
            ? `Đã cập nhật thông tin khách hàng "${values.name}"`
            : `Đã tạo khách hàng mới "${values.name}"`,
        })

        // Chuyển hướng sau khi thành công
        if (isEditing && customer) {
          router.push(`/dashboard/customers/${customer.id}`)
        } else {
          router.push("/dashboard/customers")
        }
        router.refresh()
      } else {
        setError(result.error || "Không thể lưu thông tin khách hàng")
        toast({
          title: "Có lỗi xảy ra",
          description: result.error || "Không thể lưu thông tin khách hàng",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(error instanceof Error ? error.message : "Lỗi không xác định")
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể lưu thông tin khách hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}</CardTitle>
        <CardDescription>
          {isEditing ? "Cập nhật thông tin chi tiết của khách hàng" : "Nhập thông tin chi tiết để tạo khách hàng mới"}
        </CardDescription>
      </CardHeader>

      {error && (
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      )}

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
                    <FormDescription>Mã khách hàng sẽ được tạo tự động nếu để trống</FormDescription>
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
                    <FormLabel>
                      Tên khách hàng <span className="text-red-500">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Loại khách hàng <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="company" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center">
                            <Building className="mr-2 h-4 w-4 text-blue-500" />
                            Doanh nghiệp
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="individual" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center">
                            <User className="mr-2 h-4 w-4 text-green-500" />
                            Cá nhân
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="government" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center">
                            <Landmark className="mr-2 h-4 w-4 text-purple-500" />
                            Cơ quan nhà nước
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Trạng thái */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Trạng thái <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Đang hợp tác</SelectItem>
                        <SelectItem value="potential">Tiềm năng</SelectItem>
                        <SelectItem value="inactive">Ngừng hợp tác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Người liên hệ */}
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên người liên hệ" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chức vụ */}
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chức vụ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập chức vụ người liên hệ" {...field} value={field.value || ""} />
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
                      <Input placeholder="Nhập số điện thoại" {...field} value={field.value || ""} />
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
                      <Input placeholder="Nhập địa chỉ email" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mã số thuế */}
              <FormField
                control={form.control}
                name="tax_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã số thuế" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kênh bán hàng */}
              <FormField
                control={form.control}
                name="sales_channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kênh bán hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập kênh bán hàng" {...field} value={field.value || ""} />
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
                    <Input placeholder="Nhập địa chỉ" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ghi chú */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập ghi chú về khách hàng"
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

          {debugInfo && (
            <CardContent>
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">Debug Info</summary>
                <pre className="mt-2 w-full overflow-auto rounded-md bg-slate-950 p-4 text-xs text-white">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </CardContent>
          )}

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
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
