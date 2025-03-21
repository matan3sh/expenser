'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { cn } from '@/lib/utils'
import { CategoryWithBudget } from '@/types/category.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus as PlusIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Zod schema for category validation
const categorySchema = z.object({
  title: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Name too long'),
  budget: z
    .number()
    .min(0, 'Budget must be positive')
    .max(1000000, 'Budget too high'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategorySheetProps {
  mode: 'create' | 'edit'
  category?: CategoryWithBudget
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CategoryFormData) => Promise<void>
}

export const CategorySheet: React.FC<CategorySheetProps> = ({
  mode,
  category,
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { settings } = useSettings()
  const { formatAmount } = useCurrencyFormat()
  const maxBudget = 50000 // Maximum budget value

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category?.title || '',
      budget: category?.budget?.amount || 1000,
    },
  })

  const currentBudget = watch('budget')

  useEffect(() => {
    if (category) {
      reset({
        title: category.title,
        budget: category.budget?.amount || 1000,
      })
    } else {
      reset({
        title: '',
        budget: 1000,
      })
    }
  }, [category, reset, open])

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data)
  })

  const sheetContent = (
    <SheetContent className="sm:max-w-md">
      <div className="p-6 pb-4 border-b">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </SheetTitle>
        </SheetHeader>
      </div>

      <form onSubmit={onFormSubmit} className="space-y-6 p-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="mb-2">
            Category Name
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Category name"
            className="h-12 text-lg"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label className="mb-2">Monthly Budget</Label>
          <div className="space-y-6">
            <Slider
              value={[currentBudget]}
              onValueChange={(values) => setValue('budget', values[0])}
              max={maxBudget}
              step={100}
              className="py-4"
            />
            <div className="text-2xl font-semibold text-center">
              {formatAmount(currentBudget, settings.displayCurrency?.code)}
            </div>
            {errors.budget && (
              <p className="text-sm text-destructive">
                {errors.budget.message}
              </p>
            )}
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
            {mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </SheetContent>
  )

  // Only render trigger button for create mode
  return mode === 'create' ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'group relative flex items-center justify-center',
            'h-9 overflow-hidden',
            'bg-primary/10 hover:bg-primary/20',
            'transition-all duration-300 ease-spring',
            'w-[130px] rounded-2xl border-2 border-primary',
            'hover:w-[140px] hover:rounded-xl',
            'before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2',
            'before:h-6 before:w-6 before:rounded-full before:bg-primary',
            'before:transition-transform before:duration-300',
            'before:flex before:items-center before:justify-center',
            'hover:before:scale-110',
            'text-primary font-medium',
            'hover:font-semibold',
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
      </SheetTrigger>
      {sheetContent}
    </Sheet>
  ) : (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {sheetContent}
    </Sheet>
  )
}
