'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CategoryWithBudget } from '@/types/category.types'
import { useState } from 'react'

interface DeleteCategoryModalProps {
  category: CategoryWithBudget
  categories: CategoryWithBudget[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  categories,
  open,
  onOpenChange,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const availableCategories = categories.filter((c) => c.id !== category.id)

  const handleDelete = async () => {
    if (!selectedCategoryId) return

    try {
      // Add your delete logic here
      // await deleteCategory(category.id, selectedCategoryId)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl">Delete Category</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Please select a category to move existing expenses before deleting{' '}
              <span className="font-medium">{category.name}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <Select
              value={selectedCategoryId}
              onValueChange={setSelectedCategoryId}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={!selectedCategoryId}
              className="flex-1 h-12"
            >
              Delete Category
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
