import { ExpensesCharts } from '@/components/expenses/ExpensesCharts'
import { ExpensesDataTable } from '@/components/expenses/ExpensesDataTable'
import { MobileExpensesView } from '@/components/expenses/MobileExpensesView'

export default async function ExpensesPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:block p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Expenses Overview
          </h1>
          <p className="text-muted-foreground">
            Comprehensive view of all your expenses with analytics and filtering
            options.
          </p>
        </div>
        <ExpensesCharts />
        <ExpensesDataTable />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="px-4 py-3 mt-14">
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
        </div>
        <MobileExpensesView />
      </div>
    </div>
  )
}
