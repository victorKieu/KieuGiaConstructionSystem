import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import ProjectsList from "@/components/projects/projects-list"
import DbConnectionChecker from "@/components/db-connection-checker"

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý dự án</h1>

      <DbConnectionChecker />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Danh sách dự án</h2>
          <p className="text-muted-foreground">Quản lý tất cả các dự án xây dựng</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link href="/dashboard/projects/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo dự án mới
          </Link>
        </Button>
      </div>

      <ProjectsList />
    </div>
  )
}
