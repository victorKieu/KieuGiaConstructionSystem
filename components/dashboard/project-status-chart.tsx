"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  status: string
  count: number
  color: string
}

interface ProjectStatusChartProps {
  data: ChartData[]
  title: string
}

export function ProjectStatusChart({ data, title }: ProjectStatusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Vẽ biểu đồ tròn
    const total = data.reduce((sum, item) => sum + item.count, 0)
    let startAngle = 0

    // Xóa canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Vẽ biểu đồ
    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.count) / total

      ctx.beginPath()
      ctx.moveTo(100, 100)
      ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle)
      ctx.fillStyle = item.color
      ctx.fill()

      startAngle += sliceAngle
    })

    // Vẽ hình tròn trắng ở giữa để tạo hiệu ứng donut
    ctx.beginPath()
    ctx.arc(100, 100, 50, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()

    // Vẽ chú thích
    const legendY = 220
    data.forEach((item, index) => {
      const x = 20
      const y = legendY + index * 25

      // Vẽ ô màu
      ctx.fillStyle = item.color
      ctx.fillRect(x, y, 15, 15)

      // Vẽ text
      ctx.fillStyle = "#000"
      ctx.font = "14px Arial"
      ctx.fillText(`${item.status} (${item.count})`, x + 25, y + 12)
    })
  }, [data])

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground">Không có dữ liệu</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas ref={canvasRef} width="200" height="300" />
      </CardContent>
    </Card>
  )
}
