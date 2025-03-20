'use client'

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
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { Plus as PlusIcon } from 'lucide-react'
import { useState } from 'react'

export const CreateCategoryButton: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [budget, setBudget] = useState(100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Add your create category logic here
      // await createCategory({ name, budget })
      setName('')
      setBudget(100)
      setOpen(false)
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            // Base styles
            'group relative flex items-center justify-center',
            'h-9 overflow-hidden',
            'bg-primary/10 hover:bg-primary/20',
            'transition-all duration-300 ease-spring',
            // Mobile styles
            'w-[130px] rounded-2xl border-2 border-primary',
            'hover:w-[140px] hover:rounded-xl',
            // Icon container
            'before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2',
            'before:h-6 before:w-6 before:rounded-full before:bg-primary',
            'before:transition-transform before:duration-300',
            'before:flex before:items-center before:justify-center',
            'hover:before:scale-110',
            // Text styling
            'text-primary font-medium',
            'hover:font-semibold',
            // Ensure proper spacing for icon and text
            'pl-8'
          )}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center">
            <PlusIcon
              className={cn(
                'h-4 w-4 text-background',
                'transition-transform duration-300',
                'group-hover:rotate-90'
              )}
            />
          </div>
          <span className="translate-x-1">Add New</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full"
              autoComplete="off"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Monthly Budget</Label>
              <span className="text-sm font-medium">
                ${budget.toLocaleString()}
              </span>
            </div>
            <Slider
              value={[budget]}
              onValueChange={([value]) => setBudget(value)}
              min={0}
              max={1000}
              step={10}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$0</span>
              <span>$1,000</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
