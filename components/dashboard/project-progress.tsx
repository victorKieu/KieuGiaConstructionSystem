import { ProjectProgressBar } from "./project-progress-bar"

// Dữ liệu mẫu cho các dự án
const projectsData = [
  {
    id: 1,
    name: "Chung cư Sunshine City",
    progress: 75,
    status: "Đang thực hiện",
    deadline: "15/12/2023",
  },
  {
    id: 2,
    name: "Khu đô thị Green Park",
    progress: 45,
    status: "Đang thực hiện",
    deadline: "30/03/2024",
  },
  {
    id: 3,
    name: "Trung tâm thương mại Diamond Plaza",
    progress: 90,
    status: "Đang thực hiện",
    deadline: "10/11/2023",
  },
  {
    id: 4,
    name: "Nhà máy sản xuất Vinfast",
    progress: 30,
    status: "Đang thực hiện",
    deadline: "22/05/2024",
  },
]

export function ProjectProgress() {
  // Sử dụng dữ liệu mẫu thay vì gọi API
  const projects = projectsData

  return (
    <div className="space-y-4">
      {projects && projects.length > 0 ? (
        projects.map((project) => (
          <div key={project.id} className="flex items-center">
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{project.name}</span>
                <span className="text-sm text-muted-foreground">{project.deadline}</span>
              </div>
              <ProjectProgressBar progress={project.progress} />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">Không có dự án nào</div>
      )}
    </div>
  )
}
