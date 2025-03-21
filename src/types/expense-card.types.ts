import { Expense } from '@/types/expense.types'

export interface ExpenseCardProps {
  expense: Expense
  children?: React.ReactNode
}

export interface ExpenseEditForm {
  description: string
  amount: number
  date: string
  location: string
  notes: string
}

export interface ExpenseCardState {
  isOpen: boolean
  isEditing: boolean
  isDeleting: boolean
  editForm: ExpenseEditForm
}
