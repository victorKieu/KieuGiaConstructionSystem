import Link from "next/link"

export default function ProjectsPage() {
  // Dữ liệu mẫu cho các dự án
  const projects = [
    { id: 1, name: "Chung cư Sunshine", status: "Đang thực hiện", progress: 65 },
    { id: 2, name: "Biệt thự Green Park", status: "Hoàn thành", progress: 100 },
    { id: 3, name: "Văn phòng Central Plaza", status: "Đang thực hiện", progress: 30 },
    { id: 4, name: "Nhà máy Tân Phú", status: "Tạm dừng", progress: 45 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý dự án</h1>
        <Link
          href="/dashboard/projects/create"
          className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
        >
          Thêm dự án mới
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên dự án
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiến độ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      project.status === "Hoàn thành"
                        ? "bg-green-100 text-green-800"
                        : project.status === "Đang thực hiện"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        project.progress === 100
                          ? "bg-green-600"
                          : project.progress > 50
                            ? "bg-amber-500"
                            : "bg-amber-400"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{project.progress}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/dashboard/projects/${project.id}`} className="text-amber-600 hover:text-amber-900 mr-4">
                    Xem
                  </Link>
                  <Link href={`/dashboard/projects/${project.id}/edit`} className="text-amber-600 hover:text-amber-900">
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
