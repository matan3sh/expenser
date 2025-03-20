import { prisma } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'

export type CategoryWithBudget = {
  id: string
  title: string
  createdAt: Date
  budget: {
    id: string
    amount: number
    currency: string
    createdAt: Date
  } | null
}

export async function getCategories(): Promise<CategoryWithBudget[]> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: userId,
    },
    include: {
      budget: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return categories.map((category) => ({
    ...category,
    budget: category.budget
      ? {
          ...category.budget,
          amount: Number(category.budget.amount),
        }
      : null,
  }))
}
