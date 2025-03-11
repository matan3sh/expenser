'use client'

import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { useSearchParams } from 'next/navigation'

export default function AddExpensePage() {
  const searchParams = useSearchParams()
  const formData = searchParams.get('data')

  // Parse the data if coming from receipt upload
  const initialData = formData
    ? JSON.parse(decodeURIComponent(formData))
    : undefined

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add Expense</h2>
        <p className="text-muted-foreground">
          Record a new expense with all the details
        </p>
      </div>
      <div className="border rounded-lg p-6">
        <ExpenseForm initialData={initialData} />
      </div>
    </div>
  )
}
