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
import { Slider } from '@/components/ui/slider'
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { CategoryWithBudget } from '@/types/category.types'
import { useEffect, useState } from 'react'

interface EditCategoryModalProps {
  category: CategoryWithBudget
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  category,
  open,
  onOpenChange,
}) => {
  const { settings } = useSettings()
  const { formatAmount } = useCurrencyFormat()
  const [name, setName] = useState(category.title)
  const [budget, setBudget] = useState(category.budget?.amount || 0)
  const maxBudget = Math.max(category.budget?.amount || 0, 10000) * 2 // Dynamic max based on current budget

  // Reset form when dialog opens with a new category
  useEffect(() => {
    if (open) {
      setName(category.title)
      setBudget(category.budget?.amount || 0)
    }
  }, [open, category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add your update logic here
      // await updateCategory(category.id, { name, budget })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Category</DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Category Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base">Monthly Budget</Label>
            <div className="space-y-6">
              <Slider
                value={[budget]}
                onValueChange={(values) => setBudget(values[0])}
                max={maxBudget}
                step={100}
                className="py-4"
              />
              <div className="text-2xl font-semibold text-center">
                {formatAmount(budget, settings.displayCurrency?.code)}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
