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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="flex flex-col gap-4 p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
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
