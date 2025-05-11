interface ProjectProgressBarProps {
  progress: number
}

export function ProjectProgressBar({ progress }: ProjectProgressBarProps) {
  // Đảm bảo giá trị tiến độ nằm trong khoảng 0-100
  const safeProgress = Math.min(Math.max(0, progress), 100)

  // Xác định màu sắc dựa trên tiến độ
  const getColorClass = () => {
    if (safeProgress < 30) return "bg-red-500"
    if (safeProgress < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className={`h-2 rounded-full ${getColorClass()}`} style={{ width: `${safeProgress}%` }} />
      </div>
      <span className="text-xs font-medium">{safeProgress}%</span>
    </div>
  )
}
