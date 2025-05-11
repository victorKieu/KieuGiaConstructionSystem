import { Skeleton } from "@/components/ui/skeleton"
import { MainLayout } from "@/components/layout/main-layout"

export default function ProjectListLoading() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-5 p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <Skeleton className="h-8 w-full max-w-sm" />
          </div>
          <div className="border-t">
            <div className="grid grid-cols-7 border-b">
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="p-4 font-medium">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="grid grid-cols-7 border-b">
                  <div className="p-4">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
