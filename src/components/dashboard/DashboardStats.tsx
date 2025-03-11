import { StatCard } from './StatCard'

const CURRENT_MONTH_TEXT = 'For current month'

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Expenses"
        value="$1,234.56"
        subtitle={CURRENT_MONTH_TEXT}
      />
      <StatCard
        title="Receipts Uploaded"
        value={12}
        subtitle={CURRENT_MONTH_TEXT}
      />
      <StatCard title="Categories" value={8} subtitle="Active categories" />
    </div>
  )
}
