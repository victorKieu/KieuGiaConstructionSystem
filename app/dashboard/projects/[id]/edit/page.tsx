"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { getProjectById, updateProject, getCustomers } from "@/lib/actions/project-actions"

// Schema cho form chỉnh sửa dự án
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tên dự án phải có ít nhất 2 ký tự",
  }),
  code: z.string().min(2, {
    message: "Mã dự án phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
  location: z.string().min(2, {
    message: "Địa điểm dự án phải có ít nhất 2 ký tự",
  }),
  start_date: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  end_date: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  }),
  budget: z.string().optional(),
  status: z.string({
    required_error: "Vui lòng chọn trạng thái",
  }),
  progress: z.coerce.number().min(0).max(100),
  customer_id: z.string({
    required_error: "Vui lòng chọn khách hàng",
  }),
  project_type: z.string().optional(),
  construction_type: z.string({
    required_error: "Vui lòng chọn hạng mục",
  }),
  project_manager: z.string().optional(),
  complexity: z.string().optional(),
  priority: z.string().optional(),
  risk_level: z.string().optional(),
  contact_name: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email({ message: "Email không hợp lệ" }).optional().or(z.literal("")),
})

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Khởi tạo form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      location: "",
      start_date: new Date(),
      end_date: new Date(),
      budget: "",
      status: "planning",
      progress: 0,
      project_type: "",
      construction_type: "townhouse",
      project_manager: "",
      complexity: "medium",
      priority: "normal",
      risk_level: "low",
      customer_id: "",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
    },
  })

  // Lấy thông tin dự án và danh sách khách hàng khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      try {
        const [projectResult, customersResult] = await Promise.all([getProjectById(params.id), getCustomers()])

        if (projectResult.success && projectResult.data) {
          const project = projectResult.data

          // Chuyển đổi ngày từ string sang Date object
          const startDate = project.start_date ? new Date(project.start_date) : new Date()
          const endDate = project.end_date ? new Date(project.end_date) : new Date()

          form.reset({
            name: project.name || "",
            code: project.code || "",
            description: project.description || "",
            location: project.location || "",
            start_date: startDate,
            end_date: endDate,
            budget: project.budget ? project.budget.toString() : "",
            status: project.status || "planning",
            progress: project.progress || 0,
            project_type: project.project_type || "",
            construction_type: project.construction_type || "townhouse",
            project_manager: project.project_manager || "",
            complexity: project.complexity || "medium",
            priority: project.priority || "normal",
            risk_level: project.risk_level || "low",
            customer_id: project.customer_id || "",
            contact_name: project.contact_name || "",
            contact_phone: project.contact_phone || "",
            contact_email: project.contact_email || "",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể lấy thông tin dự án. Vui lòng thử lại sau.",
          })
          router.push("/dashboard")
        }

        if (customersResult.success) {
          setCustomers(customersResult.data)
        } else {
          toast({
            variant: "destructive",
            title: "Lỗi",
            description: "Không thể lấy danh sách khách hàng. Vui lòng thử lại sau.",
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi lấy dữ liệu. Vui lòng thử lại sau.",
        })
        router.push("/dashboard")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [params.id, router, form])

  // Xử lý khi submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Chuyển đổi budget từ string sang number
      const budgetValue = values.budget ? Number.parseFloat(values.budget.replace(/[^\d.-]/g, "")) : 0

      const projectData = {
        ...values,
        budget: budgetValue,
      }

      const result = await updateProject(params.id, projectData)

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Dự án đã được cập nhật thành công",
        })
        router.push("/dashboard")
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: result.error || "Không thể cập nhật dự án. Vui lòng thử lại sau.",
        })
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi cập nhật dự án. Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa dự án</h1>
          <p className="text-muted-foreground">Cập nhật thông tin dự án</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Cập nhật thông tin cơ bản của dự án</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input placeholder="Mã dự án" {...field} readOnly />
                      </FormControl>
                      <FormDescription>Mã dự án không thể thay đổi sau khi đã tạo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customer_id"
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
                          {customers.map((customer: any) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="construction_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hạng mục</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hạng mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="townhouse">Nhà phố</SelectItem>
                          <SelectItem value="residential">Nhà ở</SelectItem>
                          <SelectItem value="commercial">Thương mại</SelectItem>
                          <SelectItem value="industrial">Công nghiệp</SelectItem>
                          <SelectItem value="infrastructure">Hạ tầng</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngân sách</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập ngân sách dự án" {...field} />
                      </FormControl>
                      <FormDescription>Ngân sách dự kiến cho dự án (VNĐ)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả dự án" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
              <CardDescription>Thông tin người liên hệ của dự án</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_name"
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
                  name="contact_phone"
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
              </div>

              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email liên hệ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin quản lý</CardTitle>
              <CardDescription>Thông tin quản lý dự án</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">Kế hoạch</SelectItem>
                          <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                          <SelectItem value="on_hold">Tạm dừng</SelectItem>
                          <SelectItem value="completed">Hoàn thành</SelectItem>
                          <SelectItem value="cancelled">Đã hủy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiến độ (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" placeholder="Nhập tiến độ dự án" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="project_manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quản lý dự án</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên quản lý dự án" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="complexity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Độ phức tạp</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn độ phức tạp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức độ ưu tiên</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức độ ưu tiên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="normal">Thường</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
                          <SelectItem value="urgent">Khẩn cấp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="risk_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mức độ rủi ro</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mức độ rủi ro" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Cập nhật dự án"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
