import type { Metadata } from "next"
import ProjectForm from "@/components/projects/project-form"

export const metadata: Metadata = {
  title: "Tạo dự án mới",
  description: "Tạo một dự án mới trong hệ thống quản lý dự án",
}

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tạo dự án mới</h1>
        <p className="text-muted-foreground mt-2">Điền thông tin chi tiết để tạo một dự án mới trong hệ thống.</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
