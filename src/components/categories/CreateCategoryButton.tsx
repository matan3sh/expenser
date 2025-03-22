'use client'

import { CategorySheet } from '@/components/categories/CategorySheet'
import { useState } from 'react'

interface CategoryFormData {
  title: string
  budget: number
  color: string
}

export const CreateCategoryButton: React.FC = () => {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      console.log(data)
      // Update your create category logic to include color
      // await createCategory({
      //   name: data.title,
      //   budget: data.budget,
      //   color: data.color
      // })
      setOpen(false)
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
    />
  )
}
