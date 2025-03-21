import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ExpenseEditForm as ExpenseEditFormType } from '@/types/expense-card.types'

interface ExpenseEditFormProps {
  editForm: ExpenseEditFormType
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onCancel: () => void
  onUpdate: () => void
}

export function ExpenseEditForm({
  editForm,
  onInputChange,
  onCancel,
  onUpdate,
}: ExpenseEditFormProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Edit Form Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Expense</h2>
        </div>
      </div>

      {/* Edit Form Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={editForm.description}
              onChange={onInputChange}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={editForm.amount}
              onChange={onInputChange}
              className="h-10"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={editForm.date}
              onChange={onInputChange}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={editForm.location}
              onChange={onInputChange}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={editForm.notes}
              onChange={onInputChange}
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Edit Form Footer */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 h-11">
            Cancel
          </Button>
          <Button onClick={onUpdate} className="flex-1 h-11">
            Update
          </Button>
        </div>
      </div>
    </div>
  )
}
