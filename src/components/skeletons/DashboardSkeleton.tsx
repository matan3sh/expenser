import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 min-h-[calc(100vh-3rem)]">
      <header className="space-y-0.5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </header>

      <DashboardStatsSkeleton />
      <DashboardChartsSkeleton />
    </div>
  )
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-7 w-32" />
        </Card>
      ))}
    </div>
  )
}

function DashboardChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <ChartCardSkeleton />
      <ChartCardSkeleton />
    </div>
  )
}

function ChartCardSkeleton() {
  return (
    <Card className="flex flex-col h-[400px] md:h-[500px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  )
}
