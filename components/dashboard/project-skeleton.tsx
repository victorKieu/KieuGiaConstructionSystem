import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProjectSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full ml-2" />
            </div>
          </div>

          <div className="mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 mr-2 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 border-t mt-4">
        <div className="flex justify-between items-center w-full">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </CardFooter>
    </Card>
  )
}

export function ProjectListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <ProjectSkeleton key={index} />
          ))}
      </div>
    </div>
  )
}
