import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] p-6">
      <div className="mb-4">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <div className="grid h-[calc(100%-theme(spacing.24))] gap-6">
        {/* Monthly Comparison Skeleton */}
        <div className="rounded-lg border p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Daily Patterns Skeleton */}
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="h-[300px]">
              <Skeleton className="h-full w-full" />
            </div>
          </div>

          {/* Top Locations Skeleton */}
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="h-[300px]">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
