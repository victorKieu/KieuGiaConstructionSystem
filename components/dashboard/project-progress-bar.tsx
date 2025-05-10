interface ProjectProgressBarProps {
  label?: string
  value: number
  color?: string
  description?: string
}

export function ProgressBar({ label, value, color = "#3498db", description }: ProjectProgressBarProps) {
  // Đảm bảo giá trị tiến độ nằm trong khoảng 0-100
  const safeValue = Math.min(Math.max(0, value), 100)

  return (
    <div className="space-y-1">
      {label && <div className="text-sm font-medium">{label}</div>}
      <div className="flex items-center justify-between">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 rounded-full" style={{ width: `${safeValue}%`, backgroundColor: color }} />
        </div>
        {description && <span className="text-sm ml-2 text-muted-foreground">{description}</span>}
      </div>
    </div>
  )
}
