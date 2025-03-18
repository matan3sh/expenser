import { PrismaClient } from '@prisma/client'
import { categories } from '../src/data/categories'
import { currencies } from '../src/data/currencies'

const prisma = new PrismaClient()

async function main() {
  // Sample user for testing (you can modify this)
  const testUser = await prisma.user.upsert({
    where: { userId: 'test_clerk_user_id' },
    update: {},
    create: {
      userId: 'test_clerk_user_id',
      email: 'test@example.com',
      credits: 100,
      budget: 2000,
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
        budget: category.budget,
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
