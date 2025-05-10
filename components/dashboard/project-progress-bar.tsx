"use client"

interface ProjectProgressBarProps {
  progress: number
  label?: string
  description?: string
  color?: string
}

export function ProgressBar({ progress, label, description, color }: ProjectProgressBarProps) {
  // Đảm bảo progress nằm trong khoảng 0-100
  const safeProgress = Math.min(Math.max(0, progress), 100)

  // Xác định màu sắc dựa trên tiến độ
  const getColorClass = () => {
    if (safeProgress < 25) return "bg-red-500"
    if (safeProgress < 50) return "bg-orange-500"
    if (safeProgress < 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="w-full">
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color || getColorClass()} transition-all duration-300 ease-in-out`}
            style={{ width: `${safeProgress}%` }}
          />
        </div>
        {description && <span className="text-sm font-medium">{description}</span>}
      </div>
    </div>
  )
}
