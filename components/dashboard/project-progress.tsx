"use client"

import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  status: string
  progress?: number
  startDate?: string
  endDate?: string
}

interface ProjectProgressProps {
  projects: Project[]
}

export function ProjectProgress({ projects }: ProjectProgressProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-muted-foreground">Chưa có dự án nào đang thực hiện</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div key={project.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground">
                {project.startDate && new Date(project.startDate).toLocaleDateString("vi-VN")} -{" "}
                {project.endDate && new Date(project.endDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <p className="text-sm font-medium">{project.progress || 0}%</p>
          </div>
          <Progress value={project.progress || 0} className="h-2" />
        </div>
      ))}
    </div>
  )
}
