'use server'

import { prisma } from '@/db/prisma'
import { Prisma } from '@prisma/client'

const PAGE_SIZE = 10

export async function getAllExpenses({
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
  userId: string // Required userId parameter
  query?: string
  limit?: number
  page?: number
  category?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  sort?: string
}) {
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

  return {
    expenses,
    totalPages: Math.ceil(totalExpenses / limit),
    totalExpenses,
  }
}

/**
 * Retrieves all expenses for a specific month
 */
export async function getExpensesForSelectedMonth({
  userId,
  selectedMonth,
  limit = PAGE_SIZE,
  page = 1,
  category,
  sort,
}: {
  userId: string // Required userId parameter
  selectedMonth: string | Date // Accept date string or Date object
  limit?: number
  page?: number
  category?: string
  sort?: string
}) {
  // Convert selectedMonth to start and end dates
  const monthDate =
    typeof selectedMonth === 'string' ? new Date(selectedMonth) : selectedMonth

  // Create first day of the month
  const startDate = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  ).toISOString()

  // Create last day of the month
  const endDate = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0,
    23,
    59,
    59
  ).toISOString()

  // Pass userId to getAllExpenses
  return getAllExpenses({
    userId,
    startDate,
    endDate,
    limit,
    page,
    category,
    sort,
  })
}
