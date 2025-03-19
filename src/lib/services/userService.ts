import { categories } from '@/data/categories'
import { currencies } from '@/data/currencies'
import { prisma } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'

export class UserService {
  static async initializeUser(userId: string) {
    const dbUser = await prisma.user.findUnique({
      where: { userId },
    })

    if (dbUser) return null // User already exists

    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)

    // Use transaction to ensure all operations succeed or fail together
    return prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          avatar: clerkUser.imageUrl,
          credits: 0,
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
            create: categories.map((category) => ({
              title: category.name,
              budget: {
                create: {
                  amount: category.budget,
                  currency: 'USD',
                },
              },
            })),
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

      // Fetch categories for creating expenses
      const createdCategories = await tx.category.findMany({
        where: { userId: user.userId },
      })

      // Add sample expenses
      const sampleExpenses = [
        {
          date: new Date('2024-03-15'),
          description: 'Weekly Groceries',
          amount: 150.75,
          currency: 'USD',
          location: 'Whole Foods',
          categoryId: createdCategories.find((c) => c.title === 'Groceries')
            ?.id,
        },
        {
          date: new Date('2024-03-14'),
          description: 'Electricity Bill',
          amount: 85.5,
          currency: 'USD',
          location: 'Electric Company',
          categoryId: createdCategories.find((c) => c.title === 'Utilities')
            ?.id,
        },
        {
          date: new Date('2024-03-13'),
          description: 'Movie Night',
          amount: 120.0,
          currency: 'USD',
          location: 'AMC Theater',
          categoryId: createdCategories.find((c) => c.title === 'Entertainment')
            ?.id,
        },
        {
          date: new Date('2024-03-12'),
          description: 'Gas',
          amount: 250.0,
          currency: 'USD',
          location: 'Shell Gas Station',
          categoryId: createdCategories.find((c) => c.title === 'Transport')
            ?.id,
        },
        {
          date: new Date('2024-02-28'),
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

      return user
    })
  }
}
