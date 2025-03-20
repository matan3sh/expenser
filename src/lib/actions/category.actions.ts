import { prisma } from '@/db/prisma'
import { getExchangeRates } from '@/lib/actions/settings.actions'
import { convertExpense } from '@/lib/utils/expense.utils'
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
  expenses: {
    id: string
    date: string
    description: string
    amount: number
    currency: string
    location: string
    notes: string | null
    receipt: string | null
    categoryId: string
    createdAt: string
    updatedAt: string
    converted?: {
      amount: number
      symbol: string
    }
  }[]
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

  const settings = (userSettings?.settings as DBSettings) || {
    displayCurrency: { code: 'USD' },
    exchangeRates: {},
  }

  const selectedMonth = settings?.selectedMonth || {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  }

  const exchangeRates = await getExchangeRates(
    (userSettings?.settings as DBSettings)?.displayCurrency?.code || 'USD'
  )

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
    color: `var(--chart-${(index % 5) + 1})`,
    createdAt: category.createdAt.toISOString(),
    budget: category.budget
      ? {
          id: category.budget.id,
          amount: Number(category.budget.amount),
          currency: category.budget.currency,
          createdAt: category.budget.createdAt.toISOString(),
        }
      : null,
    expenses: category.expenses.map((expense) => {
      const convertedExpense = convertExpense(
        expense as unknown as Expense,
        settings,
        exchangeRates
      )
      return {
        id: expense.id,
        date: expense.date.toISOString(),
        description: expense.description,
        amount: Number(expense.amount),
        currency: expense.currency,
        location: expense.location || '',
        notes: expense.notes,
        receipt: expense.receipt,
        categoryId: expense.categoryId || category.id,
        createdAt: expense.createdAt.toISOString(),
        updatedAt: expense.updatedAt.toISOString(),
        converted: convertedExpense.converted,
      }
    }),
  }))
}
