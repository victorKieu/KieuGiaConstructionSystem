import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function EmployeesLoading() {
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 min-w-0 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-24 hidden md:block" />
                <Skeleton className="h-4 w-32 hidden md:block" />
                <Skeleton className="h-4 w-24 hidden md:block" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
