"use client"

import { Bar, BarChart as RechartsBarChart } from "recharts"
import { Line, LineChart as RechartsLineChart } from "recharts"
import { Pie, PieChart as RechartsPieChart, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { CartesianGrid, XAxis, YAxis } from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  className?: string
}

interface DonutChartProps {
  data: any[]
  category: string
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLabel?: boolean
  showAnimation?: boolean
  className?: string
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  className,
}: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          {showXAxis && <XAxis dataKey={index} />}
          {showYAxis && <YAxis />}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip
            formatter={(value: number, name: string) => [valueFormatter(value), name]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"],
  valueFormatter = (value: number) => value.toString(),
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  className,
}: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          {showXAxis && <XAxis dataKey={index} />}
          {showYAxis && <YAxis />}
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value: number, name: string) => [valueFormatter(value), name]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DonutChart({
  data,
  category,
  index,
  colors = ["#2563eb", "#f59e0b", "#10b981", "#8b5cf6"],
  valueFormatter = (value: number) => value.toString(),
  showLabel = true,
  showAnimation = true,
  className,
}: DonutChartProps) {
  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return showLabel ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="90%"
            innerRadius="60%"
            dataKey={category}
            nameKey={index}
            isAnimationActive={showAnimation}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [valueFormatter(value), ""]}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
