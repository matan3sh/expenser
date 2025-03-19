import { auth } from '@clerk/nextjs/server'

// Track already initialized users to prevent duplicate requests
const initializedUsers = new Set<string>()

export async function initializeUser() {
  try {
    const { userId } = await auth()

    // Skip if no user or already initialized
    if (!userId || initializedUsers.has(userId)) {
      return { success: true, message: 'No initialization needed' }
    }

    // Mark user as initialized to prevent duplicate requests
    initializedUsers.add(userId)

    // Import the initialization action directly (server action)
    // This is the recommended approach in Next.js App Router
    const { initUserAction } = await import('@/app/api/auth/init/action')
    const result = await initUserAction({ userId })

    if (!result.success) {
      throw new Error(`Failed to initialize user: ${result.error}`)
    }

    return { success: true, message: 'User initialized successfully' }
  } catch (error) {
    console.error('Error initializing user:', error)
    return { success: false, error: (error as Error).message }
  }
}
