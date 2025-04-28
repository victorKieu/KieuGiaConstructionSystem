"use client"

import { useState, useEffect } from "react"

interface ProjectProgressCircleProps {
  progress?: number
  size?: number
  strokeWidth?: number
  showPercentage?: boolean
  color?: string
  backgroundColor?: string
  className?: string
}

export function ProjectProgressCircle({
  progress = 0,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  color = "#10b981",
  backgroundColor = "#e5e7eb",
  className = "",
}: ProjectProgressCircleProps) {
  const [currentProgress, setCurrentProgress] = useState(0)

  // Tính toán các thông số cho circle
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress)
    }, 100)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={backgroundColor} strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-semibold">{Math.round(currentProgress)}%</span>
        </div>
      )}
    </div>
  )
}

export default ProjectProgressCircle
