"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Dữ liệu mẫu cho biểu đồ hiệu suất
const performanceData = [
  {
    name: "T1",
    doanhthu: 4000,
    chiphi: 2400,
  },
  {
    name: "T2",
    doanhthu: 3000,
    chiphi: 1398,
  },
  {
    name: "T3",
    doanhthu: 2000,
    chiphi: 9800,
  },
  {
    name: "T4",
    doanhthu: 2780,
    chiphi: 3908,
  },
  {
    name: "T5",
    doanhthu: 1890,
    chiphi: 4800,
  },
  {
    name: "T6",
    doanhthu: 2390,
    chiphi: 3800,
  },
  {
    name: "T7",
    doanhthu: 3490,
    chiphi: 4300,
  },
  {
    name: "T8",
    doanhthu: 4000,
    chiphi: 2400,
  },
  {
    name: "T9",
    doanhthu: 3000,
    chiphi: 1398,
  },
  {
    name: "T10",
    doanhthu: 2000,
    chiphi: 9800,
  },
  {
    name: "T11",
    doanhthu: 2780,
    chiphi: 3908,
  },
  {
    name: "T12",
    doanhthu: 1890,
    chiphi: 4800,
  },
]

export function PerformanceChart() {
  // Sử dụng state để kiểm soát việc render
  const [isClient, setIsClient] = useState(false)

  // Chỉ render sau khi component được mount ở client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Nếu không phải ở client, hiển thị placeholder
  if (!isClient) {
    return <div className="h-[300px] flex items-center justify-center">Đang tải biểu đồ...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={performanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="doanhthu" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="chiphi" name="Chi phí" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
