'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Trash2 } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

interface Category {
  id: string
  name: string
  color: string
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Food & Dining', color: '#FF6B6B' },
    { id: '2', name: 'Transportation', color: '#4ECDC4' },
    { id: '3', name: 'Shopping', color: '#45B7D1' },
    { id: '4', name: 'Bills & Utilities', color: '#96CEB4' },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', color: '#FF6B6B' })

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return

    const category: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategory.name.trim(),
      color: newCategory.color,
    }

    setCategories([...categories, category])
    setNewCategory({ name: '', color: '#FF6B6B' })
    setIsDialogOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, name: e.target.value })
  }

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ ...newCategory, color: e.target.value })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for your expenses
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={handleNameChange}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={newCategory.color}
                  onChange={handleColorChange}
                  className="h-10 w-full"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="divide-y">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
