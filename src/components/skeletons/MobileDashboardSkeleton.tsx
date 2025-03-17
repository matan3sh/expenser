import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function MobileDashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Weekly Volume Chart Skeleton */}
      <Card className="h-[300px]">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-[200px] px-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 w-[10%]">
                <Skeleton className="w-full max-w-[20px] h-[100px]" />
                <Skeleton className="w-6 h-3" />
                <Skeleton className="w-8 h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Expense List Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-7 w-36" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}
