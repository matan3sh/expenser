'use client'

import { CategoryDialog } from '@/components/categories/CategoryDialog'
import { useState } from 'react'

export const CreateCategoryButton: React.FC = () => {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (data: { title: string; budget: number }) => {
    try {
      console.log(data)
      // Add your create category logic here
      // await createCategory({ name: data.title, budget: data.budget })
      setOpen(false)
    } catch (error) {
      console.error('Failed to create category:', error)
    }
  }

  return (
    <CategoryDialog
      mode="create"
      open={open}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
    />
  )
}
