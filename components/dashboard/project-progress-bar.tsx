"use client"

interface ProgressBarProps {
  label: string
  value: number
  color: string
  showPercentage?: boolean
  description?: string
}

export function ProgressBar({ label, value, color, showPercentage = true, description }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100)

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        {showPercentage && <span className="text-xs font-medium">{percentage}%</span>}
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
        </div>
        {description && <span className="text-xs text-gray-500 mt-1 inline-block">{description}</span>}
      </div>
    </div>
  )
}
