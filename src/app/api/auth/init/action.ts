'use server'

import { UserService } from '@/lib/services/userService'

export async function initUserAction({ userId }: { userId: string }) {
  try {
    const result = await UserService.initializeUser(userId)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
