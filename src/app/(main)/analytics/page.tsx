'use client'

import { DailyPatterns } from '@/components/analytics/DailyPatterns'
import { MonthlyComparison } from '@/components/analytics/MonthlyComparison'
import { TopLocations } from '@/components/analytics/TopLocations'

export default function AnalyticsPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Advanced insights into your spending habits
        </p>
      </div>
      <div className="grid h-[calc(100%-theme(spacing.24))] gap-6">
        <MonthlyComparison />
        <div className="grid gap-6 md:grid-cols-2">
          <DailyPatterns />
          <TopLocations />
        </div>
      </div>
    </div>
  )
}
