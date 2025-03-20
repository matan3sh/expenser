'use server'

import { prisma } from '@/db/prisma'
import { getExchangeRates } from '@/lib/actions/settings.actions'
import {
  convertExpense,
  PAGE_SIZE,
  serializeExpenses,
} from '@/lib/utils/expense.utils'
import { DatabaseExpense, Expense } from '@/types/expense'
import { DBSettings } from '@/types/settings'
import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'

export async function getAllExpenses(
  {
    userId,
    query,
    limit = PAGE_SIZE,
    page = 1,
    category,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sort,
  }: {
    userId: string
    query?: string
    limit?: number
    page?: number
    category?: string
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
    sort?: string
  },
  exchangeRates: Record<string, number>
) {
  // Query filter for search by description or notes
  const queryFilter: Prisma.ExpenseWhereInput =
    query && query !== 'all'
      ? {
          OR: [
            {
              description: {
                contains: query,
                mode: 'insensitive',
              } as Prisma.StringFilter,
            },
            {
              notes: {
                contains: query,
                mode: 'insensitive',
              } as Prisma.StringFilter,
            },
          ],
        }
      : {}

  // Category filter
  const categoryFilter: Prisma.ExpenseWhereInput =
    category && category !== 'all' ? { categoryId: category } : {}

  // Date range filter
  const dateFilter: Prisma.ExpenseWhereInput = {}
  if (startDate || endDate) {
    const dateCondition: Prisma.DateTimeFilter = {}
    if (startDate) dateCondition.gte = new Date(startDate)
    if (endDate) dateCondition.lte = new Date(endDate)
    dateFilter.date = dateCondition
  }

  // Amount range filter
  const amountFilter: Prisma.ExpenseWhereInput = {}
  if (minAmount !== undefined || maxAmount !== undefined) {
    const amountCondition: Prisma.DecimalFilter = {}
    if (minAmount !== undefined) amountCondition.gte = minAmount
    if (maxAmount !== undefined) amountCondition.lte = maxAmount
    amountFilter.amount = amountCondition
  }

  // Modify the function to retrieve user settings
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

  // Fetch paginated expenses - now include userId filter
  const expenses = await prisma.expense.findMany({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      ...queryFilter,
      ...categoryFilter,
      ...dateFilter,
      ...amountFilter,
    },
    orderBy:
      sort === 'amount_low'
        ? { amount: 'asc' }
        : sort === 'amount_high'
        ? { amount: 'desc' }
        : sort === 'newest'
        ? { date: 'desc' }
        : sort === 'oldest'
        ? { date: 'asc' }
        : { date: 'desc' }, // Default to newest first
    skip: page && limit ? (page - 1) * limit : 0,
    take: limit,
  })

  // Get total count for pagination - now include userId filter
  const totalExpenses = await prisma.expense.count({
    where: {
      users: {
        some: {
          userId: userId,
        },
      },
      ...queryFilter,
      ...categoryFilter,
      ...dateFilter,
      ...amountFilter,
    },
  })

  // Convert expenses before returning
  const convertedExpenses = expenses.map((expense) =>
    convertExpense(expense as unknown as Expense, settings, exchangeRates)
  )

  return {
    expenses: serializeExpenses(
      convertedExpenses as unknown as DatabaseExpense[]
    ),
    totalPages: Math.ceil(totalExpenses / limit),
    totalExpenses,
  }
}

/**
 * Retrieves all expenses for a specific month
 */
export async function getExpensesForSelectedMonth({
  limit = PAGE_SIZE,
  page = 1,
  category,
  sort,
}: {
  limit?: number
  page?: number
  category?: string
  sort?: string
}) {
  const { userId } = await auth()

  if (!userId) {
    return {
      expenses: [],
      totalPages: 0,
      totalExpenses: 0,
    }
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

  // Now safely use selectedMonth
  const startDate = new Date(
    selectedMonth.year,
    selectedMonth.month,
    1
  ).toISOString()

  // Create last day of the month
  const endDate = new Date(
    selectedMonth.year,
    selectedMonth.month + 1,
    0,
    23,
    59,
    59
  ).toISOString()

  const exchangeRates = await getExchangeRates(
    (userSettings?.settings as DBSettings)?.displayCurrency?.code || 'USD'
  )

  // Pass userId to getAllExpenses
  return getAllExpenses(
    {
      userId,
      startDate,
      endDate,
      limit,
      page,
      category,
      sort,
    },
    exchangeRates
  )
}
