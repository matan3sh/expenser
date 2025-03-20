import { PrismaClient } from '@prisma/client'

declare global {
  var cachedPrisma: PrismaClient
}

export const db =
  global.cachedPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') {
  global.cachedPrisma = db
}
