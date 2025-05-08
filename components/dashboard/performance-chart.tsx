"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PerformanceChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dữ liệu mẫu cho biểu đồ
  const performanceData = [
    { month: "T1", revenue: 12, cost: 8, profit: 4 },
    { month: "T2", revenue: 15, cost: 10, profit: 5 },
    { month: "T3", revenue: 18, cost: 12, profit: 6 },
    { month: "T4", revenue: 14, cost: 9, profit: 5 },
    { month: "T5", revenue: 16, cost: 11, profit: 5 },
    { month: "T6", revenue: 19, cost: 13, profit: 6 },
    { month: "T7", revenue: 22, cost: 15, profit: 7 },
    { month: "T8", revenue: 25, cost: 17, profit: 8 },
    { month: "T9", revenue: 23, cost: 16, profit: 7 },
    { month: "T10", revenue: 26, cost: 18, profit: 8 },
    { month: "T11", revenue: 28, cost: 19, profit: 9 },
    { month: "T12", revenue: 30, cost: 21, profit: 9 },
  ]

  const maxValue = Math.max(...performanceData.map((item) => item.revenue))
  const chartHeight = 200

  if (!mounted) {
    return <div className="h-full flex items-center justify-center">Đang tải biểu đồ...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiệu suất công ty theo tháng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>T1</div>
                <div>T2</div>
                <div>T3</div>
                <div>T4</div>
                <div>T5</div>
                <div>T6</div>
                <div>T7</div>
                <div>T8</div>
                <div>T9</div>
                <div>T10</div>
                <div>T11</div>
                <div>T12</div>
              </div>

              {/* Doanh thu */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Doanh thu (tỷ VNĐ)</div>
                <div className="relative h-[50px]">
                  <div className="absolute inset-0 flex items-end">
                    {performanceData.map((item, index) => (
                      <div key={`revenue-${index}`} className="flex-1 mx-0.5">
                        <div
                          className="bg-blue-500 rounded-t-sm"
                          style={{
                            height: `${(item.revenue / maxValue) * 100}%`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chi phí */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Chi phí (tỷ VNĐ)</div>
                <div className="relative h-[50px]">
                  <div className="absolute inset-0 flex items-end">
                    {performanceData.map((item, index) => (
                      <div key={`cost-${index}`} className="flex-1 mx-0.5">
                        <div
                          className="bg-red-500 rounded-t-sm"
                          style={{
                            height: `${(item.cost / maxValue) * 100}%`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lợi nhuận */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Lợi nhuận (tỷ VNĐ)</div>
                <div className="relative h-[50px]">
                  <div className="absolute inset-0 flex items-end">
                    {performanceData.map((item, index) => (
                      <div key={`profit-${index}`} className="flex-1 mx-0.5">
                        <div
                          className="bg-green-500 rounded-t-sm"
                          style={{
                            height: `${(item.profit / maxValue) * 100}%`,
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                <span className="text-sm">Doanh thu</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span className="text-sm">Chi phí</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-sm">Lợi nhuận</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
