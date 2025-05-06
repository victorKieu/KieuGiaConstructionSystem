import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"

export default function InventoryDashboardLoading() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-36" />
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Thống kê chi tiết theo loại kho */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-3 w-36 mt-1" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Biểu đồ so sánh giá trị tồn kho theo loại kho */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64 mb-1" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-96" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <Skeleton className="h-6 w-64 mb-1" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <Skeleton className="h-6 w-64 mb-1" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
