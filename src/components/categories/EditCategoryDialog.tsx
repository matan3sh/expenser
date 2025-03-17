import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Category } from '@/types/category'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'

interface EditCategoryDialogProps {
  category: Category
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  category,
}) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category.name)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add your update logic here
      // await updateCategory(category.id, { name })
      setOpen(false)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PencilIcon className="h-4 w-4" />
          <span className="sr-only">Edit category</span>
        </Button>
      </DialogTrigger>
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
              onClick={() => setOpen(false)}
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
