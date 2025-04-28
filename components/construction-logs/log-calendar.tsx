"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { vi } from "date-fns/locale"

export function LogCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Trong thực tế, dữ liệu này sẽ được lấy từ API
  const logEntries = [
    {
      date: new Date(2023, 0, 15), // 15/01/2023
      projects: [{ id: 1, name: "Chung cư ABC", activity: "Khởi công dự án" }],
    },
    {
      date: new Date(2023, 0, 20), // 20/01/2023
      projects: [{ id: 1, name: "Chung cư ABC", activity: "Đào móng" }],
    },
    {
      date: new Date(2023, 1, 5), // 05/02/2023
      projects: [{ id: 2, name: "Biệt thự XYZ", activity: "Đổ bê tông móng" }],
    },
    {
      date: new Date(2023, 1, 20), // 20/02/2023
      projects: [{ id: 2, name: "Biệt thự XYZ", activity: "Thi công cột tầng 1" }],
    },
    {
      date: new Date(2023, 2, 10), // 10/03/2023
      projects: [{ id: 3, name: "Nhà máy DEF", activity: "Chuẩn bị mặt bằng" }],
    },
    {
      date: new Date(2023, 2, 15), // 15/03/2023
      projects: [
        { id: 1, name: "Chung cư ABC", activity: "Đổ bê tông sàn tầng 1" },
        { id: 2, name: "Biệt thự XYZ", activity: "Thi công tường tầng 1" },
      ],
    },
  ]

  // Hàm kiểm tra xem ngày có nhật ký không
  const hasLogEntry = (date: Date) => {
    return logEntries.some(
      (entry) =>
        entry.date.getDate() === date.getDate() &&
        entry.date.getMonth() === date.getMonth() &&
        entry.date.getFullYear() === date.getFullYear(),
    )
  }

  // Lấy các nhật ký cho ngày được chọn
  const getLogEntriesForDate = (date: Date) => {
    return logEntries.filter(
      (entry) =>
        entry.date.getDate() === date.getDate() &&
        entry.date.getMonth() === date.getMonth() &&
        entry.date.getFullYear() === date.getFullYear(),
    )
  }

  // Xử lý khi chọn ngày
  const handleSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Lịch nhật ký</CardTitle>
          <CardDescription>Xem nhật ký theo ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            locale={vi}
            className="rounded-md border"
            modifiers={{
              hasLog: (date) => hasLogEntry(date),
            }}
            modifiersStyles={{
              hasLog: { backgroundColor: "#e0f2fe", fontWeight: "bold" },
            }}
          />
          <div className="mt-4 flex items-center justify-center text-sm">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-blue-100"></div>
              <span>Có nhật ký</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedDate ? `Nhật ký ngày ${selectedDate.toLocaleDateString("vi-VN")}` : "Chọn ngày để xem nhật ký"}
          </CardTitle>
          <CardDescription>Chi tiết nhật ký công trình theo ngày</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <>
              {getLogEntriesForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getLogEntriesForDate(selectedDate).map((entry, index) => (
                    <div key={index}>
                      {entry.projects.map((project) => (
                        <div key={project.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge>{project.name}</Badge>
                            <span className="text-sm text-gray-500">{entry.date.toLocaleDateString("vi-VN")}</span>
                          </div>
                          <p className="font-medium">{project.activity}</p>
                          <div className="mt-2 flex justify-end">
                            <button className="text-sm text-blue-600 hover:underline">Xem chi tiết</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-gray-500">Không có nhật ký nào cho ngày này</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-gray-500">Vui lòng chọn ngày để xem nhật ký</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
