import { ExpenseCardProps, ExpenseCardState } from '@/types/expense-card.types'
import { format } from 'date-fns'
import { useState } from 'react'

export const useExpenseCard = ({
  expense,
}: Pick<ExpenseCardProps, 'expense'>) => {
  const [state, setState] = useState<ExpenseCardState>({
    isOpen: false,
    isEditing: false,
    isDeleting: false,
    editForm: {
      description: '',
      amount: 0,
      date: '',
      location: '',
      notes: '',
    },
  })

  const setIsOpen = (isOpen: boolean) =>
    setState((prev) => ({ ...prev, isOpen }))

  const handleOpenReceipt = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(true)
  }

  const handleEditClick = () => {
    setState((prev) => ({
      ...prev,
      isDeleting: false,
      isEditing: true,
      editForm: {
        description: expense.description || '',
        amount: expense.amount,
        date: format(new Date(expense.date), 'yyyy-MM-dd'),
        location: expense.location || '',
        notes: expense.notes || '',
      },
    }))
  }

  const handleDeleteClick = () => {
    setState((prev) => ({
      ...prev,
      isEditing: false,
      isDeleting: true,
    }))
  }

  const handleCancelEdit = () => {
    setState((prev) => ({ ...prev, isEditing: false }))
  }

  const handleCancelDelete = () => {
    setState((prev) => ({ ...prev, isDeleting: false }))
  }

  const handleUpdateExpense = async () => {
    try {
      // Implement your update logic here
      // await updateExpense(expense.id, state.editForm)
      console.log('Updating expense:', expense.id, state.editForm)

      setState((prev) => ({ ...prev, isEditing: false }))
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  const handleDeleteExpense = async () => {
    try {
      // Implement your delete logic here
      // await deleteExpense(expense.id)
      console.log('Deleting expense:', expense.id)

      setState((prev) => ({
        ...prev,
        isOpen: false,
        isDeleting: false,
      }))
    } catch (error) {
      console.error('Failed to delete expense:', error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      editForm: {
        ...prev.editForm,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value,
      },
    }))
  }

  return {
    state,
    handlers: {
      setIsOpen,
      handleOpenReceipt,
      handleEditClick,
      handleDeleteClick,
      handleCancelEdit,
      handleCancelDelete,
      handleUpdateExpense,
      handleDeleteExpense,
      handleInputChange,
    },
  }
}
