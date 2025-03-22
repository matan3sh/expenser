import { PrismaClient } from '@prisma/client'
import { currencies } from '../src/data/currencies'

const prisma = new PrismaClient()

// First, define the proper types
interface SeedCategory {
  id: string
  name: string
  color: string
  budget: {
    amount: number
    currency: string
  }
}

// Then define your seed data with the correct structure
const categories: SeedCategory[] = [
  {
    id: 'uuid-1',
    name: 'Groceries',
    color: '#22c55e',
    budget: {
      amount: 500,
      currency: 'USD',
    },
  },
  {
    id: 'uuid-2',
    name: 'Utilities',
    color: '#3b82f6',
    budget: {
      amount: 300,
      currency: 'USD',
    },
  },
  // ... other categories
]

async function main() {
  // Sample user for testing (you can modify this)
  const testUser = await prisma.user.upsert({
    where: { userId: 'test_clerk_user_id' },
    update: {},
    create: {
      userId: 'test_clerk_user_id',
      email: 'test@example.com',
      credits: 100,
      budgets: {
        create: {
          amount: 2000,
          currency: 'USD',
          date: new Date(),
        },
      },
    },
  })

  // Seed categories for the test user
  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        id: category.id,
      },
      update: {},
      create: {
        id: category.id,
        title: category.name,
        color: category.color,
        budget: {
          create: {
            amount: category.budget.amount,
            currency: category.budget.currency,
          },
        },
        userId: testUser.userId,
      },
    })
  }

  // Seed currencies for the test user
  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: {
        id: currency.code,
      },
      update: {},
      create: {
        id: currency.code,
        title: currency.name,
        symbol: currency.symbol,
        userId: testUser.userId,
      },
    })
  }

  // Add some sample expenses
  await prisma.expense.create({
    data: {
      date: new Date(),
      description: 'Grocery shopping',
      amount: 50.99,
      currency: 'USD',
      location: 'Local Supermarket',
      categoryId: 'groceries',
      users: {
        create: {
          userId: testUser.userId,
        },
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
