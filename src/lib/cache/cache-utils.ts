import { prisma } from '@/db/prisma'
import { unstable_cache } from 'next/cache'

// Cache user settings with a short TTL to ensure fresh data
export const getCachedUserSettings = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { settings: true },
    })
    return user?.settings
  },
  ['user-settings'],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ['user-settings'],
  }
)

// Cache initialization state
export const getCachedInitializationState = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { id: true },
    })
    return !!user
  },
  ['user-initialization'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['user-initialization'],
  }
)
