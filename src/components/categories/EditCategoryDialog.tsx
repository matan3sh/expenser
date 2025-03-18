import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category } from '@/types/category'
import { useEffect, useState } from 'react'

interface EditCategoryDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
  open,
  onOpenChange,
}) => {
  const [name, setName] = useState(category.name)

  // Reset name when dialog opens with a new category
  useEffect(() => {
    if (open) {
      setName(category.name)
    }
  }, [open, category.name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add your update logic here
      // await updateCategory(category.id, { name })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
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
