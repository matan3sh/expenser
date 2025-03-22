import { currencies } from '@/data/currencies'
import { serverError, serverLog } from '@/lib/logging'
import { prisma } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'

// Default settings matching what's in SettingsContext, but without exchangeRates
const defaultUserSettings = {
  displayCurrency: { code: 'USD', name: 'US Dollar', symbol: '$' },
  theme: 'system',
  selectedMonth: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  useGeminiAI: true,
}

const DEFAULT_CATEGORIES = [
  {
    title: 'Groceries',
    color: '#22c55e', // Green
    budget: {
      create: {
        amount: 500,
        currency: 'USD',
      },
    },
  },
  {
    title: 'Utilities',
    color: '#3b82f6', // Blue
    budget: {
      create: {
        amount: 300,
        currency: 'USD',
      },
    },
  },
  {
    title: 'Entertainment',
    color: '#f59e0b', // Yellow
    budget: {
      create: {
        amount: 200,
        currency: 'USD',
      },
    },
  },
  {
    title: 'Transport',
    color: '#ef4444', // Red
    budget: {
      create: {
        amount: 400,
        currency: 'USD',
      },
    },
  },
  {
    title: 'Other',
    color: '#64748b', // Slate
    budget: {
      create: {
        amount: 100,
        currency: 'USD',
      },
    },
  },
]

export class UserService {
  static async initializeUser(userId: string) {
    try {
      serverLog('Checking if user exists in database:', userId)
      const dbUser = await prisma.user.findUnique({
        where: { userId },
        select: {
          id: true,
          userId: true,
          settings: true,
        },
      })

      if (dbUser) {
        serverLog('User already exists in database:', userId)

        // Return the existing user but not as a new user
        return {
          userId: dbUser.userId,
          isExistingUser: true,
          // Include existing settings
          settings: dbUser.settings,
        }
      }

      serverLog('Fetching user from Clerk:', userId)
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)

      if (!clerkUser) {
        serverError('User not found in Clerk:', userId)
        throw new Error('User not found in authentication provider')
      }

      serverLog('Creating new user in database with default settings:', userId)

      // Use transaction to ensure all operations succeed or fail together
      const user = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            userId,
            email:
              clerkUser.emailAddresses[0]?.emailAddress ||
              'unknown@example.com',
            avatar: clerkUser.imageUrl,
            credits: 0,
            settings: defaultUserSettings, // Add default settings
            // Create initial user budget
            budgets: {
              create: {
                amount: 1500,
                currency: 'USD',
                date: new Date(),
              },
            },
            // Create categories in the same transaction
            categories: {
              create: DEFAULT_CATEGORIES,
            },
            currencies: {
              createMany: {
                data: currencies.map((currency) => ({
                  title: currency.name,
                  symbol: currency.symbol,
                })),
              },
            },
          },
          include: {
            categories: {
              include: {
                budget: true,
              },
            },
            currencies: true,
            budgets: true,
          },
        })

        serverLog('User created, setting up sample data')

        // Fetch categories for creating expenses
        const createdCategories = await tx.category.findMany({
          where: { userId: user.userId },
        })

        // Add sample expenses
        const sampleExpenses = [
          {
            date: new Date('2025-03-15'),
            description: 'Weekly Groceries',
            amount: 150.75,
            currency: 'USD',
            location: 'Whole Foods',
            categoryId: createdCategories.find((c) => c.title === 'Groceries')
              ?.id,
          },
          {
            date: new Date('2025-03-14'),
            description: 'Electricity Bill',
            amount: 85.5,
            currency: 'USD',
            location: 'Electric Company',
            categoryId: createdCategories.find((c) => c.title === 'Utilities')
              ?.id,
          },
          {
            date: new Date('2025-03-13'),
            description: 'Movie Night',
            amount: 120.0,
            currency: 'USD',
            location: 'AMC Theater',
            categoryId: createdCategories.find(
              (c) => c.title === 'Entertainment'
            )?.id,
          },
          {
            date: new Date('2025-03-12'),
            description: 'Gas',
            amount: 250.0,
            currency: 'USD',
            location: 'Shell Gas Station',
            categoryId: createdCategories.find((c) => c.title === 'Transport')
              ?.id,
          },
          {
            date: new Date('2025-02-28'),
            description: 'Monthly Groceries',
            amount: 420.3,
            currency: 'USD',
            location: 'Costco',
            categoryId: createdCategories.find((c) => c.title === 'Groceries')
              ?.id,
          },
        ]

        // Create expenses and establish user relationships through the join table
        for (const expenseData of sampleExpenses) {
          await tx.expense.create({
            data: {
              date: expenseData.date,
              description: expenseData.description,
              amount: new Prisma.Decimal(expenseData.amount),
              currency: expenseData.currency,
              location: expenseData.location,
              categoryId: expenseData.categoryId,
              users: {
                create: {
                  userId: user.userId,
                },
              },
            },
          })
        }

        serverLog('User initialization complete with default settings:', userId)
        return {
          ...user,
          isNewUser: true,
        }
      })

      return user
    } catch (error) {
      serverError('User initialization failed:', error)
      throw error // Re-throw to let the caller handle it
    }
  }
}
