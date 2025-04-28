import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogsList } from "@/components/construction-logs/logs-list"
import { LogTimeline } from "@/components/construction-logs/log-timeline"
import { LogCalendar } from "@/components/construction-logs/log-calendar"
import { LogDashboard } from "@/components/construction-logs/log-dashboard"

export const metadata: Metadata = {
  title: "Nhật ký công trình | Kieu Gia Construction",
  description: "Quản lý nhật ký công trình",
}

export default function ConstructionLogsPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Nhật ký công trình</h1>
        <p className="text-gray-500">Quản lý nhật ký tiến độ công trình</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Danh sách</TabsTrigger>
          <TabsTrigger value="calendar">Lịch</TabsTrigger>
          <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
          <TabsTrigger value="dashboard">Bảng điều khiển</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <LogsList />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <LogCalendar />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
          <LogTimeline />
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-6">
          <LogDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
