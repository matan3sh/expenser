import { categories } from '@/data/categories'
import { currencies } from '@/data/currencies'
import { prisma } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'

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
          // Create categories and currencies in the same transaction
          categories: {
            createMany: {
              data: categories.map((category) => ({
                title: category.name,
              })),
            },
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
          categories: true,
          currencies: true,
        },
      })

      // Add sample expenses
      const sampleExpenses = [
        {
          date: new Date('2024-03-15'),
          description: 'Weekly Groceries',
          amount: 150.75,
          currency: 'USD',
          location: 'Whole Foods',
          categoryId: user.categories.find((c) => c.title === 'Groceries')?.id,
          userId: user.userId,
        },
        {
          date: new Date('2024-03-14'),
          description: 'Electricity Bill',
          amount: 85.5,
          currency: 'USD',
          location: 'Electric Company',
          categoryId: user.categories.find((c) => c.title === 'Utilities')?.id,
          userId: user.userId,
        },
        {
          date: new Date('2024-03-13'),
          description: 'Movie Night',
          amount: 120.0,
          currency: 'USD',
          location: 'AMC Theater',
          categoryId: user.categories.find((c) => c.title === 'Entertainment')
            ?.id,
          userId: user.userId,
        },
        {
          date: new Date('2024-03-12'),
          description: 'Gas',
          amount: 250.0,
          currency: 'USD',
          location: 'Shell Gas Station',
          categoryId: user.categories.find((c) => c.title === 'Transport')?.id,
          userId: user.userId,
        },
        {
          date: new Date('2024-02-28'),
          description: 'Monthly Groceries',
          amount: 420.3,
          currency: 'USD',
          location: 'Costco',
          categoryId: user.categories.find((c) => c.title === 'Groceries')?.id,
          userId: user.userId,
        },
      ]

      // Create all expenses in bulk
      await tx.expense.createMany({
        data: sampleExpenses,
      })

      return user
    })
  }
}
