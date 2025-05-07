"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building, Landmark, User, Save, Loader2, MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  type CustomerFormData,
  createCustomer,
  updateCustomer,
  getSalesChannels,
  getCustomerCountByType,
  generateCustomerCode,
} from "@/lib/actions/customer-actions"

// Schema validation cho form
const customerSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(2, {
    message: "Tên khách hàng phải có ít nhất 2 ký tự",
  }),
  type: z.enum(["company", "individual", "government"], {
    required_error: "Vui lòng chọn loại khách hàng",
  }),
  status: z.enum(["active", "potential", "inactive"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
  phone: z.string().optional(),
  email: z
    .string()
    .email({
      message: "Email không hợp lệ",
    })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  tax_code: z.string().optional(),
  website: z
    .string()
    .url({
      message: "Website không hợp lệ",
    })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  birthday: z.string().optional(),
  sales_channel: z.string().optional(),
  geocode: z.string().optional(),
})

type CustomerFormProps = {
  customer?: CustomerFormData | null
}

export function CustomerForm({ customer = null }: CustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const isEditing = !!customer
  const salesChannels = getSalesChannels()

  // Khởi tạo form với giá trị mặc định
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      code: customer?.code || "",
      name: customer?.name || "",
      type: customer?.type || "company",
      status: customer?.status || "active",
      phone: customer?.phone || "",
      email: customer?.email || "",
      address: customer?.address || "",
      tax_code: customer?.tax_code || "",
      website: customer?.website || "",
      description: customer?.description || "",
      birthday: customer?.birthday || "",
      sales_channel: customer?.sales_channel || "",
      geocode: customer?.geocode || "",
    },
  })

  // Theo dõi thay đổi loại khách hàng để tạo mã
  const watchType = form.watch("type")

  // Tạo mã khách hàng khi thay đổi loại
  useEffect(() => {
    if (!isEditing && watchType) {
      const generateCode = async () => {
        const count = await getCustomerCountByType(watchType)
        const code = generateCustomerCode(watchType, count)
        setGeneratedCode(code)
        form.setValue("code", code)
      }
      generateCode()
    }
  }, [watchType, isEditing, form])

  // Xử lý khi submit form
  async function onSubmit(values: z.infer<typeof customerSchema>) {
    setIsSubmitting(true)
    try {
      let result

      if (isEditing && customer?.id) {
        // Cập nhật khách hàng
        result = await updateCustomer(customer.id, values as CustomerFormData)
      } else {
        // Tạo khách hàng mới
        result = await createCustomer(values as CustomerFormData)
      }

      if (result.success) {
        toast({
          title: isEditing ? "Cập nhật thành công" : "Tạo mới thành công",
          description: isEditing
            ? `Đã cập nhật thông tin khách hàng "${values.name}"`
            : `Đã tạo khách hàng mới "${values.name}"`,
        })

        // Chuyển hướng sau khi thành công
        router.push("/dashboard/customers")
        router.refresh()
      } else {
        toast({
          title: "Có lỗi xảy ra",
          description: result.error || "Không thể lưu thông tin khách hàng",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể lưu thông tin khách hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Lấy label cho loại khách hàng
  const getCustomerTypeLabel = (type: string) => {
    switch (type) {
      case "individual":
        return "Ngày sinh"
      case "company":
        return "Ngày thành lập công ty"
      case "government":
        return "Ngày thành lập cơ quan"
      default:
        return "Ngày sinh/thành lập"
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

              {/* Mã khách hàng */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã khách hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={generatedCode || "Chọn loại khách hàng để tạo mã"}
                        {...field}
                        disabled={isEditing}
                      />
                    </FormControl>
                    <FormDescription>Mã khách hàng được tạo tự động dựa trên loại khách hàng</FormDescription>
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

              {/* Ngày sinh/thành lập */}
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{getCustomerTypeLabel(form.getValues("type"))}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kênh bán hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {salesChannels.map((channel) => (
                          <SelectItem key={channel.value} value={channel.value}>
                            {channel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      <Input placeholder="Nhập mã số thuế" {...field} />
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
                      <Input placeholder="Nhập địa chỉ website" {...field} />
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
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Geocode */}
            <FormField
              control={form.control}
              name="geocode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí địa lý (Geocode)</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input placeholder="Nhập tọa độ (vd: 21.0285,105.8542)" {...field} className="flex-1" />
                      <Button
                        type="button"
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const geocode = `${position.coords.latitude},${position.coords.longitude}`
                                form.setValue("geocode", geocode)
                              },
                              (error) => {
                                toast({
                                  title: "Lỗi",
                                  description: "Không thể lấy vị trí hiện tại",
                                  variant: "destructive",
                                })
                              },
                            )
                          }
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Vị trí hiện tại
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Nhập tọa độ dưới dạng "vĩ độ,kinh độ" hoặc sử dụng vị trí hiện tại</FormDescription>
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
                    <Textarea placeholder="Nhập thông tin mô tả về khách hàng" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
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
