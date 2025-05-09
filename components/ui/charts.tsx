"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  labels: string[]
  datasets: {
    label?: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
  }[]
}

interface ChartProps {
  data: ChartData
  height?: number
}

export function BarChart({ data, height = 300 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Vẽ biểu đồ cột bằng HTML Canvas
    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const barWidth = width / (data.labels.length * 2)
    const maxValue = Math.max(...data.datasets[0].data)

    ctx.clearRect(0, 0, width, height)

    // Vẽ trục y
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, height - 40)
    ctx.stroke()

    // Vẽ trục x
    ctx.beginPath()
    ctx.moveTo(40, height - 40)
    ctx.lineTo(width - 20, height - 40)
    ctx.stroke()

    // Vẽ các cột
    data.datasets[0].data.forEach((value, index) => {
      const x = 60 + index * (barWidth * 2)
      const barHeight = (value / maxValue) * (height - 80)

      // Vẽ cột
      ctx.fillStyle = Array.isArray(data.datasets[0].backgroundColor)
        ? (data.datasets[0].backgroundColor[index] as string)
        : (data.datasets[0].backgroundColor as string) || "#3b82f6"

      ctx.fillRect(x, height - 40 - barHeight, barWidth, barHeight)

      // Vẽ nhãn
      ctx.fillStyle = "#000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(data.labels[index], x + barWidth / 2, height - 25)

      // Vẽ giá trị
      ctx.fillText(value.toString(), x + barWidth / 2, height - 45 - barHeight)
    })

    // Vẽ tiêu đề
    if (data.datasets[0].label) {
      ctx.fillStyle = "#000"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(data.datasets[0].label, width / 2, 15)
    }
  }, [data])

  return <canvas ref={canvasRef} width="600" height="400" className="w-full h-full" />
}

export function PieChart({ data, height = 300 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Vẽ biểu đồ tròn bằng HTML Canvas
    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    ctx.clearRect(0, 0, width, height)

    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0)
    let startAngle = 0

    // Vẽ các phần của biểu đồ tròn
    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = Array.isArray(data.datasets[0].backgroundColor)
        ? (data.datasets[0].backgroundColor[index] as string)
        : "#3b82f6"

      ctx.fill()

      // Vẽ nhãn
      const labelAngle = startAngle + sliceAngle / 2
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7)
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7)

      ctx.fillStyle = "#fff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(value.toString(), labelX, labelY)

      startAngle += sliceAngle
    })

    // Vẽ chú thích
    const legendY = height - 20
    let legendX = 50

    data.labels.forEach((label, index) => {
      const color = Array.isArray(data.datasets[0].backgroundColor)
        ? (data.datasets[0].backgroundColor[index] as string)
        : "#3b82f6"

      // Vẽ ô màu
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY, 15, 15)

      // Vẽ nhãn
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(label, legendX + 20, legendY + 7)

      legendX += ctx.measureText(label).width + 50
    })
  }, [data])

  return <canvas ref={canvasRef} width="600" height="400" className="w-full h-full" />
}

export function LineChart({ data, height = 300 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Vẽ biểu đồ đường bằng HTML Canvas
    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const chartWidth = width - 60
    const chartHeight = height - 60

    ctx.clearRect(0, 0, width, height)

    // Vẽ trục y
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, height - 40)
    ctx.stroke()

    // Vẽ trục x
    ctx.beginPath()
    ctx.moveTo(40, height - 40)
    ctx.lineTo(width - 20, height - 40)
    ctx.stroke()

    const maxValue = Math.max(...data.datasets[0].data)
    const xStep = chartWidth / (data.labels.length - 1)

    // Vẽ đường
    ctx.beginPath()
    data.datasets[0].data.forEach((value, index) => {
      const x = 40 + index * xStep
      const y = height - 40 - (value / maxValue) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = (data.datasets[0].borderColor as string) || "#3b82f6"
    ctx.lineWidth = 2
    ctx.stroke()

    // Tô màu dưới đường
    if (data.datasets[0].fill) {
      ctx.lineTo(40 + (data.labels.length - 1) * xStep, height - 40)
      ctx.lineTo(40, height - 40)
      ctx.closePath()
      ctx.fillStyle = (data.datasets[0].backgroundColor as string) || "rgba(59, 130, 246, 0.1)"
      ctx.fill()
    }

    // Vẽ các điểm
    data.datasets[0].data.forEach((value, index) => {
      const x = 40 + index * xStep
      const y = height - 40 - (value / maxValue) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = (data.datasets[0].borderColor as string) || "#3b82f6"
      ctx.fill()
    })

    // Vẽ nhãn trục x
    data.labels.forEach((label, index) => {
      const x = 40 + index * xStep

      ctx.fillStyle = "#000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(label, x, height - 25)
    })

    // Vẽ tiêu đề
    if (data.datasets[0].label) {
      ctx.fillStyle = "#000"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText(data.datasets[0].label, width / 2, 15)
    }
  }, [data])

  return <canvas ref={canvasRef} width="600" height="400" className="w-full h-full" />
}

export function DonutChart({ data, height = 300 }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Vẽ biểu đồ tròn bằng HTML Canvas
    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const outerRadius = Math.min(centerX, centerY) - 40
    const innerRadius = outerRadius * 0.6

    ctx.clearRect(0, 0, width, height)

    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0)
    let startAngle = 0

    // Vẽ các phần của biểu đồ tròn
    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true)
      ctx.closePath()

      ctx.fillStyle = Array.isArray(data.datasets[0].backgroundColor)
        ? (data.datasets[0].backgroundColor[index] as string)
        : "#3b82f6"

      ctx.fill()

      // Vẽ nhãn
      const labelAngle = startAngle + sliceAngle / 2
      const labelX = centerX + (Math.cos(labelAngle) * (outerRadius + innerRadius)) / 2
      const labelY = centerY + (Math.sin(labelAngle) * (outerRadius + innerRadius)) / 2

      ctx.fillStyle = "#fff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(value.toString(), labelX, labelY)

      startAngle += sliceAngle
    })

    // Vẽ chú thích
    const legendY = height - 20
    let legendX = 50

    data.labels.forEach((label, index) => {
      const color = Array.isArray(data.datasets[0].backgroundColor)
        ? (data.datasets[0].backgroundColor[index] as string)
        : "#3b82f6"

      // Vẽ ô màu
      ctx.fillStyle = color
      ctx.fillRect(legendX, legendY, 15, 15)

      // Vẽ nhãn
      ctx.fillStyle = "#000"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(label, legendX + 20, legendY + 7)

      legendX += ctx.measureText(label).width + 50
    })

    // Vẽ tổng ở giữa
    ctx.fillStyle = "#000"
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(total.toString(), centerX, centerY)
  }, [data])

  return <canvas ref={canvasRef} width="600" height="400" className="w-full h-full" />
}
