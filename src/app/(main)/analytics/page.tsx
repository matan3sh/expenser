export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and trends from your expense data.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6 h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Expense trends chart will be displayed here
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6 h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Category breakdown chart</p>
          </div>
          <div className="rounded-lg border bg-card p-6 h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Monthly comparison chart</p>
          </div>
        </div>
      </div>
    </div>
  )
}
