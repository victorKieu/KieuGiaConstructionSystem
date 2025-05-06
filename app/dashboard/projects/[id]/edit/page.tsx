"use client"

import { useState, useEffect } from "react"
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
import { getProjectById, updateProject } from "@/lib/actions/project-actions"
import { Loader2 } from "lucide-react"

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

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Khởi tạo form với React Hook Form và Zod validation
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      location: "",
      description: "",
      budget: 0,
    },
  })

  // Lấy dữ liệu dự án khi component được mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const result = await getProjectById(params.id)

        if (result.success && result.data) {
          // Cập nhật form với dữ liệu dự án
          form.reset({
            name: result.data.name,
            code: result.data.code,
            startDate: new Date(result.data.startDate),
            endDate: new Date(result.data.endDate),
            customer: result.data.customer,
            projectType: result.data.projectType,
            location: result.data.location,
            description: result.data.description || "",
            budget: result.data.budget,
          })
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể tải thông tin dự án. Vui lòng thử lại sau.",
          })
          router.push("/dashboard/projects")
        }
      } catch (error) {
        console.error("Lỗi khi tải dự án:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tải thông tin dự án. Vui lòng thử lại sau.",
        })
        router.push("/dashboard/projects")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params.id, form, router])

  // Xử lý khi submit form
  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true)

      // Gọi server action để cập nhật dự án
      const result = await updateProject(params.id, data)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Dự án đã được cập nhật thành công.",
        })

        // Chuyển hướng đến trang chi tiết dự án sau khi cập nhật thành công
        router.push(`/dashboard/projects/${params.id}`)
      } else {
        toast({
          variant: "destructive",
          title: "Cập nhật thất bại",
          description: result.error || "Không thể cập nhật dự án. Vui lòng thử lại sau.",
        })
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật dự án:", error)
      toast({
        variant: "destructive",
        title: "Cập nhật thất bại",
        description: "Đã xảy ra lỗi khi cập nhật dự án. Vui lòng thử lại sau.",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-muted-foreground">Đang tải thông tin dự án...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Chỉnh sửa dự án</h1>
        <p className="text-gray-600">Cập nhật thông tin dự án</p>
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
                  <CardDescription>Cập nhật thông tin cơ bản của dự án</CardDescription>
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
                              <SelectItem value="customer1">Công ty TNHH ABC</SelectItem>
                              <SelectItem value="customer2">Công ty CP XYZ</SelectItem>
                              <SelectItem value="customer3">Ông Nguyễn Văn A</SelectItem>
                              <SelectItem value="customer4">Bà Trần Thị B</SelectItem>
                              <SelectItem value="customer5">Tập đoàn DEF</SelectItem>
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
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push(`/dashboard/projects/${params.id}`)}
                  >
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
                  <CardDescription>Cập nhật thông tin khối lượng công việc</CardDescription>
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
                  <CardDescription>Cập nhật thông tin dự toán chi phí</CardDescription>
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
                  <CardDescription>Cập nhật thông tin báo giá</CardDescription>
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
                      {isSubmitting ? "Đang xử lý..." : "Cập nhật dự án"}
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
