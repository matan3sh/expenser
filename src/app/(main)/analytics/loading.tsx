import { Skeleton } from '@/components/ui/skeleton'

export default function AnalyticsLoading() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] p-6">
      {/* Header Section */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="rounded-lg border p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Secondary Charts */}
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="h-[250px]">
              <Skeleton className="h-full w-full" />
            </div>
          </div>

          {/* Stats/Table */}
          <div className="rounded-lg border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
