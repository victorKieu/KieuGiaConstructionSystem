import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectOverview from "@/components/project/project-overview"
import ProjectStages from "@/components/project/project-stages"
import ProjectTasks from "@/components/project/project-tasks"
import ProjectDocuments from "@/components/project/project-documents"
import ProjectTeam from "@/components/project/project-team"
import ProjectFinancials from "@/components/project/project-financials"
import ProjectWarranty from "@/components/project/project-warranty"
import ProjectLogs from "@/components/project/project-logs"
import ProjectHeader from "@/components/project/project-header"
import prisma from "@/lib/db"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await getProject(params.id)

  if (!project) {
    return {
      title: "Dự án không tồn tại",
      description: "Không tìm thấy thông tin dự án",
    }
  }

  return {
    title: `${project.name} | Kieu Gia Construction`,
    description: project.description || "Chi tiết dự án",
  }
}

async function getProject(id: string) {
  try {
    const projectId = Number.parseInt(id)
    if (isNaN(projectId)) return null

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    return project
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <ProjectHeader project={project} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="stages">Giai đoạn</TabsTrigger>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
          <TabsTrigger value="team">Nhân sự</TabsTrigger>
          <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          <TabsTrigger value="financials">Tài chính</TabsTrigger>
          <TabsTrigger value="warranty">Bảo hành</TabsTrigger>
          <TabsTrigger value="logs">Nhật ký</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProjectOverview project={project} />
        </TabsContent>

        <TabsContent value="stages" className="mt-6">
          <ProjectStages projectId={params.id} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <ProjectTasks projectId={params.id} />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <ProjectTeam projectId={params.id} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <ProjectDocuments projectId={params.id} />
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <ProjectFinancials projectId={params.id} />
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <ProjectWarranty projectId={params.id} />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <ProjectLogs projectId={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
