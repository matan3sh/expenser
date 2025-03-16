import { UserService } from '@/lib/services/userService'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await UserService.initializeUser(userId)

    return NextResponse.json({
      success: true,
      isNewUser: !!user,
      user,
    })
  } catch (error) {
    console.error('User initialization failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
