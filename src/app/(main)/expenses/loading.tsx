import { Skeleton } from '@/components/ui/skeleton'

export default function ExpensesLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] w-full">
      {/* Search and Filter Header */}
      <div className="flex-none w-full border-b">
        <div className="flex gap-2 w-full px-4 py-2">
          <div className="flex-1">
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-9" />
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between px-4 py-1">
          <Skeleton className="h-7 w-7" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 w-7" />
        </div>
      </div>

      {/* Expense Cards Skeleton */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
