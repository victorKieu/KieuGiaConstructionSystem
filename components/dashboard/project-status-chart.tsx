"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface StatusData {
  status: string
  count: number
  color: string
}

interface ProjectStatusChartProps {
  data: StatusData[]
  title: string
}

export function ProjectStatusChart({ data, title }: ProjectStatusChartProps) {
  const [chartData, setChartData] = useState<StatusData[]>([])
  const [totalProjects, setTotalProjects] = useState(0)

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data)
      const total = data.reduce((sum, item) => sum + item.count, 0)
      setTotalProjects(total)
    }
  }, [data])

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-emerald-500 rounded-lg p-4 h-[200px] flex items-center justify-center">
        <p className="text-white">Không có dữ liệu</p>
      </div>
    )
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-emerald-500 rounded-lg p-4 h-[200px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      <div className="flex h-[150px]">
        <ResponsiveContainer width="50%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={60}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold text-white">
              {totalProjects}
            </text>
          </PieChart>
        </ResponsiveContainer>
        <div className="w-1/2 flex flex-col justify-center">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-white text-xs">{item.status}</span>
              </div>
              <div className="flex items-center">
                <span className="text-white text-xs mr-1">{item.count}</span>
                <span className="text-white text-xs">({((item.count / totalProjects) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
