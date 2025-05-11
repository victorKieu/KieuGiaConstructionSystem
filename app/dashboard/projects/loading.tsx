import { Skeleton } from "@/components/ui/skeleton"
import { ProjectListSkeleton } from "@/components/dashboard/project-skeleton"

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <ProjectListSkeleton />
    </div>
  )
}
