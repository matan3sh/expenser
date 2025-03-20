import { prisma } from '@/db/prisma'
import type { Expense } from '@/types/expense'
import { DBSettings } from '@/types/settings'
import { auth } from '@clerk/nextjs/server'

export type CategoryWithBudget = {
  id: string
  title: string
  createdAt: string
  color: string
  budget: {
    id: string
    amount: number
    currency: string
    createdAt: string
  } | null
  expenses: Expense[]
}

export async function getCategories(): Promise<CategoryWithBudget[]> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const userSettings = await prisma.user.findFirst({
    where: {
      userId,
    },
    select: {
      settings: true,
    },
  })

  // Add fallback to current month if no selectedMonth in settings
  const settings = userSettings?.settings as DBSettings
  const selectedMonth = settings?.selectedMonth || {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }

  const categories = await prisma.category.findMany({
    where: {
      userId: userId,
    },
    include: {
      budget: true,
      expenses: {
        where: {
          AND: [
            {
              date: {
                gte: new Date(selectedMonth.year, selectedMonth.month, 1),
              },
            },
            {
              date: {
                lt: new Date(selectedMonth.year, selectedMonth.month + 1, 1),
              },
            },
          ],
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return categories.map((category, index) => ({
    id: category.id,
    title: category.title,
    totalExpenses: category.expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    ),
    color: `var(--chart-${(index % 5) + 1})`,
    icon: 'circle',
    createdAt: category.createdAt.toISOString(),
    budget: category.budget
      ? {
          id: category.budget.id,
          amount: Number(category.budget.amount),
          currency: category.budget.currency,
          createdAt: category.budget.createdAt.toISOString(),
        }
      : null,
    expenses: category.expenses.map((expense) => ({
      id: expense.id,
      amount: Number(expense.amount),
      date: expense.date.toISOString(),
      description: expense.description,
      location: expense.location,
      currency: expense.currency,
      notes: expense.notes,
      receipt: expense.receipt,
      categoryId: expense.categoryId,
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    })),
  }))
}
