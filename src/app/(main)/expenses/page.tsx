import { ExpensesCharts } from '@/components/expenses/ExpensesCharts'
import { ExpensesDataTable } from '@/components/expenses/ExpensesDataTable'

export default async function ExpensesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Expenses Overview</h1>
        <p className="text-muted-foreground">
          Comprehensive view of all your expenses with analytics and filtering
          options.
        </p>
      </div>
      <ExpensesCharts />
      <ExpensesDataTable />
    </div>
  )
}
