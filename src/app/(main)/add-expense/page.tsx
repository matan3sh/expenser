import { ExpenseForm } from '@/components/expenses/ExpenseForm'

export default function AddExpensePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Expense</h2>
        <p className="text-muted-foreground">
          Record a new expense with all the details
        </p>
      </div>
      <div className="border rounded-lg p-6">
        <ExpenseForm />
      </div>
    </div>
  )
}
