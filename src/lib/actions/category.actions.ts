import { prisma } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'

export type CategoryWithBudget = {
  id: string
  title: string
  createdAt: Date
  color: string
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

  return categories.map((category, index) => ({
    id: category.id,
    title: category.title,
    totalExpenses: 0, // This will be calculated client-side
    color: `var(--chart-${(index % 5) + 1})`,
    icon: 'circle',
    createdAt: category.createdAt,
    budget: category.budget
      ? {
          ...category.budget,
          amount: Number(category.budget.amount),
        }
      : null,
  }))
}
