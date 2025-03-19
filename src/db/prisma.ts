import { PrismaClient } from '@prisma/client'

// Create Prisma client instance
const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    result: {
      expense: {
        amount: {
          compute(expense) {
            return expense.amount.toString()
          },
        },
      },
      categoryBudget: {
        amount: {
          compute(budget) {
            return budget.amount.toString()
          },
        },
      },
      userBudget: {
        amount: {
          compute(budget) {
            return budget.amount.toString()
          },
        },
      },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Export the prisma client as a singleton
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
