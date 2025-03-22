import { prisma } from '@/db/prisma'
import { getExchangeRates } from '@/lib/actions/settings.actions'
import { convertExpense } from '@/lib/utils/expense.utils'
import { CategoryWithBudget } from '@/types/category.types'
import type { Expense } from '@/types/expense.types'
import { DBSettings } from '@/types/settings.types'
import { auth } from '@clerk/nextjs/server'

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
    ...category,
    name: category.title,
    description: '',
    icon: '',
    color: category.color || `var(--chart-${(index % 5) + 1})`,
    budget: category.budget
      ? {
          amount: Number(category.budget.amount),
          currency: category.budget.currency,
        }
      : undefined,
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
        amount: Number(convertedExpense.amount),
        currency: convertedExpense.currency,
        location: expense.location || '',
        notes: expense.notes,
        receipt: expense.receipt,
        categoryId: expense.categoryId || category.id,
        category: {
          id: category.id,
          title: category.title,
          color: `var(--chart-${(index % 5) + 1})`,
        },
        createdAt: expense.createdAt.toISOString(),
        updatedAt: expense.updatedAt.toISOString(),
        converted: convertedExpense.converted,
      }
    }),
  }))
}

export async function createCategory(data: {
  title: string
  budget?: number
  color: string
}) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  return prisma.category.create({
    data: {
      title: data.title,
      color: data.color,
      user: {
        connect: {
          userId,
        },
      },
      ...(data.budget && {
        budget: {
          create: {
            amount: data.budget,
            currency: 'USD',
          },
        },
      }),
    },
  })
}
