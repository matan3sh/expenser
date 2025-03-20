'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettings } from '@/contexts/SettingsContext'
import { CategoryWithBudget } from '@/lib/actions/category.actions'
import { useEffect, useState } from 'react'

interface EditCategoryBudgetDialogProps {
  category: CategoryWithBudget
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditCategoryBudgetDialog: React.FC<
  EditCategoryBudgetDialogProps
> = ({ category, open, onOpenChange }) => {
  const { settings } = useSettings()
  const [budget, setBudget] = useState(category.budget?.toString() || '')
  const currencySymbol = settings?.displayCurrency?.symbol || '$'

  // Reset budget when dialog opens with a new category
  useEffect(() => {
    if (open) {
      setBudget(category.budget?.toString() || '')
    }
  }, [open, category.budget])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add your update logic here
      const budgetValue = budget ? parseFloat(budget) : undefined
      // await updateCategory(category.id, { budget: budgetValue })
      console.log(`Updated budget for ${category.title} to ${budgetValue}`)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update category budget:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget ({currencySymbol})</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">{currencySymbol}</span>
              </div>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter budget amount"
                className="pl-7"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Set a monthly budget for {category.title}
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
