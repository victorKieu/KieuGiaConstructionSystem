import { ProjectList } from "@/components/dashboard/project-list"
import { getProjects } from "@/lib/actions/project-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProjectListPage() {
  const result = await getProjects()
  const projects = result.success ? result.data : []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý dự án</h1>
        <Link href="/dashboard/projects/create">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm dự án mới
          </Button>
        </Link>
      </div>
      <ProjectList projects={projects || []} />
    </div>
  )
}
