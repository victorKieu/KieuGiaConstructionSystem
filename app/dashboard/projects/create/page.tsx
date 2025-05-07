"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { createProject, getCustomers } from "@/lib/actions/project-actions"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"

// Định nghĩa schema validation cho form
const projectFormSchema = z.object({
  name: z.string().min(3, { message: "Tên dự án phải có ít nhất 3 ký tự" }),
  code: z.string().min(2, { message: "Mã dự án phải có ít nhất 2 ký tự" }),
  startDate: z.date({ required_error: "Vui lòng chọn ngày bắt đầu" }),
  endDate: z.date({ required_error: "Vui lòng chọn ngày kết thúc" }),
  customer: z.string({ required_error: "Vui lòng chọn khách hàng" }),
  projectType: z.string({ required_error: "Vui lòng chọn loại dự án" }),
  location: z.string().min(3, { message: "Địa điểm phải có ít nhất 3 ký tự" }),
  description: z.string().optional(),
  budget: z.coerce.number().min(0, { message: "Ngân sách không được âm" }),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

export default function CreateProjectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)

  // Khởi tạo form với React Hook Form và Zod validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      location: "",
      description: "",
      budget: 0,
    },
  })

  // Lấy danh sách khách hàng khi component được mount
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoadingCustomers(true)
        const result = await getCustomers()
        if (result.success) {
          setCustomers(result.data)
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể tải danh sách khách hàng. Vui lòng thử lại sau.",
          })
        }
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tải danh sách khách hàng. Vui lòng thử lại sau.",
        })
      } finally {
        setIsLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [])

  // Xử lý khi submit form
  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true)

      // Gọi server action để tạo dự án mới
      const result = await createProject(data)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Dự án mới đã được tạo thành công.",
        })

        // Chuyển hướng đến trang danh sách dự án sau khi tạo thành công
        router.push("/dashboard/projects")
      } else {
        toast({
          variant: "destructive",
          title: "Tạo dự án thất bại",
          description: result.error || "Không thể tạo dự án mới. Vui lòng thử lại sau.",
        })
      }
    } catch (error) {
      console.error("Lỗi khi tạo dự án:", error)
      toast({
        variant: "destructive",
        title: "Tạo dự án thất bại",
        description: "Đã xảy ra lỗi khi tạo dự án mới. Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý chuyển tab
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Xử lý nút "Lưu & Tiếp tục"
  const handleContinue = () => {
    if (activeTab === "basic") {
      // Kiểm tra validation cho tab hiện tại trước khi chuyển
      form
        .trigger([
          "name",
          "code",
          "startDate",
          "endDate",
          "customer",
          "projectType",
          "location",
          "description",
          "budget",
        ])
        .then((isValid) => {
          if (isValid) {
            setActiveTab("quantity")
          }
        })
    } else if (activeTab === "quantity") {
      setActiveTab("estimate")
    } else if (activeTab === "estimate") {
      setActiveTab("quote")
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tạo dự án mới</h1>
        <p className="text-gray-600">Nhập thông tin dự án mới</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="quantity">Khối lượng</TabsTrigger>
              <TabsTrigger value="estimate">Dự toán</TabsTrigger>
              <TabsTrigger value="quote">Báo giá</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin dự án</CardTitle>
                  <CardDescription>Nhập thông tin cơ bản của dự án mới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên dự án</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên dự án" {...field} />
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
                          <FormLabel>Mã dự án</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập mã dự án" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày bắt đầu</FormLabel>
                          <FormControl>
                            <DatePicker date={field.value} setDate={field.onChange} placeholder="Chọn ngày bắt đầu" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày kết thúc</FormLabel>
                          <FormControl>
                            <DatePicker date={field.value} setDate={field.onChange} placeholder="Chọn ngày kết thúc" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="customer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Khách hàng</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn khách hàng" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCustomers ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Đang tải...</span>
                                </div>
                              ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="p-2 text-center text-sm">Không có dữ liệu khách hàng</div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại dự án</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại dự án" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="residential">Nhà ở</SelectItem>
                              <SelectItem value="commercial">Thương mại</SelectItem>
                              <SelectItem value="industrial">Công nghiệp</SelectItem>
                              <SelectItem value="infrastructure">Hạ tầng</SelectItem>
                              <SelectItem value="public">Công trình công cộng</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa điểm</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập địa điểm dự án" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả dự án</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập mô tả dự án" rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngân sách dự kiến (VNĐ)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Nhập ngân sách dự kiến" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => router.push("/dashboard/projects")}>
                    Hủy
                  </Button>
                  <Button type="button" onClick={handleContinue}>
                    Lưu & Tiếp tục
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="quantity">
              <Card>
                <CardHeader>
                  <CardTitle>Khối lượng</CardTitle>
                  <CardDescription>Nhập thông tin khối lượng công việc</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Tải lên bản vẽ</h3>
                      <p className="text-sm text-muted-foreground">Tải lên bản vẽ để tính toán khối lượng</p>
                    </div>
                    <Button variant="outline">Tải lên bản vẽ</Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Nhập khối lượng thủ công</h3>
                      <p className="text-sm text-muted-foreground">Nhập khối lượng công việc thủ công</p>
                    </div>
                    <Button variant="outline">Thêm mục</Button>
                  </div>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Bảng khối lượng sẽ hiển thị ở đây</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("basic")}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={handleContinue}>
                    Lưu & Tiếp tục
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="estimate">
              <Card>
                <CardHeader>
                  <CardTitle>Dự toán</CardTitle>
                  <CardDescription>Nhập thông tin dự toán chi phí</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Giá vật liệu</h3>
                      <p className="text-sm text-muted-foreground">Cập nhật giá vật liệu xây dựng</p>
                    </div>
                    <Button variant="outline">Cập nhật giá</Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Chi phí nhân công</h3>
                      <p className="text-sm text-muted-foreground">Cập nhật chi phí nhân công</p>
                    </div>
                    <Button variant="outline">Cập nhật chi phí</Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Chi phí thiết bị</h3>
                      <p className="text-sm text-muted-foreground">Cập nhật chi phí thiết bị</p>
                    </div>
                    <Button variant="outline">Cập nhật chi phí</Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Chi phí gián tiếp</h3>
                      <p className="text-sm text-muted-foreground">Cập nhật chi phí gián tiếp</p>
                    </div>
                    <Button variant="outline">Cập nhật chi phí</Button>
                  </div>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Bảng dự toán sẽ hiển thị ở đây</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("quantity")}>
                    Quay lại
                  </Button>
                  <Button type="button" onClick={handleContinue}>
                    Lưu & Tiếp tục
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="quote">
              <Card>
                <CardHeader>
                  <CardTitle>Báo giá</CardTitle>
                  <CardDescription>Nhập thông tin báo giá</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quote-number">Số báo giá</Label>
                      <Input id="quote-number" placeholder="Nhập số báo giá" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote-date">Ngày báo giá</Label>
                      <DatePicker placeholder="Chọn ngày báo giá" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Điều khoản thanh toán</Label>
                    <Textarea id="payment-terms" placeholder="Nhập điều khoản thanh toán" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validity">Hiệu lực báo giá</Label>
                    <Input id="validity" placeholder="Nhập thời hạn hiệu lực báo giá" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Ghi chú</Label>
                    <Textarea id="notes" placeholder="Nhập ghi chú bổ sung" rows={3} />
                  </div>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Xem trước báo giá sẽ hiển thị ở đây</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={() => setActiveTab("estimate")}>
                    Quay lại
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline" type="button">
                      Xuất PDF
                    </Button>
                    <Button variant="outline" type="button">
                      Gửi email
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Đang xử lý..." : "Tạo dự án"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
