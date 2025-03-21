'use client'

import { CategorySheet } from '@/components/categories/CategorySheet'
import { CategoryWithBudget } from '@/types/category.types'

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
  const handleSubmit = async (data: { title: string; budget: number }) => {
    try {
      console.log(data)
      // Add your update logic here
      // await updateCategory(category.id, { name: data.title, budget: data.budget })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  return (
    <CategorySheet
      mode="edit"
      category={category}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    />
  )
}
