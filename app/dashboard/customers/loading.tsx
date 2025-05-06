import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center py-4 gap-3">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-40 ml-auto" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex items-center justify-between py-3 border-b">
                <Skeleton className="h-5 w-full max-w-3xl" />
              </div>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b">
                    <Skeleton className="h-5 w-full max-w-4xl" />
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
