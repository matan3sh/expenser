import { prisma } from '@/db/prisma'
import { DBSettings } from '@/types/settings.types'
import { auth } from '@clerk/nextjs/server'

export async function getUserData() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      email: true,
      avatar: true,
      credits: true,
      settings: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Ensure settings has a default value if null
  const settings = (user.settings as DBSettings) || {
    displayCurrency: { code: 'USD' },
    exchangeRates: {},
    theme: 'system',
    selectedMonth: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
    useGeminiAI: false,
  }

  return {
    ...user,
    settings,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}
