import Link from "next/link"
import { ProgressBar } from "./project-progress-bar"

interface ProjectProgressProps {
  projects: any[]
}

export function ProjectProgress({ projects }: ProjectProgressProps) {
  // Sắp xếp dự án theo tiến độ giảm dần
  const sortedProjects = [...projects].sort((a, b) => (b.progress || 0) - (a.progress || 0))

  if (projects.length === 0) {
    return <p className="text-muted-foreground">Không có dự án đang thực hiện</p>
  }

  return (
    <div className="space-y-6">
      {sortedProjects.slice(0, 5).map((project) => (
        <div key={project.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Link href={`/dashboard/projects/${project.id}`} className="font-medium hover:underline">
              {project.name}
            </Link>
            <span className="text-sm text-muted-foreground">{project.code}</span>
          </div>
          <ProgressBar
            label="Tiến độ"
            value={project.progress || 0}
            color="#3498db"
            description={`${project.progress || 0}%`}
          />
        </div>
      ))}
    </div>
  )
}
