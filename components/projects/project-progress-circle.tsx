interface ProjectProgressCircleProps {
  progress: number
  size?: number
  strokeWidth?: number
}

export default function ProjectProgressCircle({ progress, size = 64, strokeWidth = 6 }: ProjectProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const dash = (progress * circumference) / 100

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getProgressColor(progress)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          strokeLinecap="round"
        />
      </svg>

      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-semibold"
        style={{ color: getProgressColor(progress) }}
      >
        {progress}%
      </div>
    </div>
  )
}

function getProgressColor(progress: number): string {
  if (progress < 25) return "#ef4444" // red-500
  if (progress < 50) return "#f97316" // orange-500
  if (progress < 75) return "#eab308" // yellow-500
  return "#22c55e" // green-500
}
