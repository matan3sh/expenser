'use client'

import { CategorySheet } from '@/components/categories/CategorySheet'
import { createCategory } from '@/lib/actions/category.actions'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

interface CategoryFormData {
  title: string
  budget: number
  color: string
}

export const CreateCategoryButton: React.FC = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      startTransition(async () => {
        await createCategory({
          title: data.title,
          budget: data.budget,
          color: data.color,
        })
        router.refresh() // Refresh the page to show the new category
        setOpen(false)
      })
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  return (
    <CategorySheet
      mode="create"
      open={open}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  )
}
