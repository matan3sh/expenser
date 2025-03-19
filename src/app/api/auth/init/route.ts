import { serverError, serverLog } from '@/lib/logging'
import { UserService } from '@/lib/services/userService'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    serverLog('Auth init route called')
    let body

    try {
      body = await request.json()
    } catch (err) {
      serverError('Failed to parse request body:', err)
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { userId } = body

    if (!userId) {
      serverLog('Auth init called without userId')
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    serverLog('Initializing user:', userId)
    const result = await UserService.initializeUser(userId)

    if (result) {
      // Check if this is a new user by looking for the isNewUser property
      if ('isNewUser' in result && result.isNewUser) {
        serverLog('New user created with default settings:', userId)
        return NextResponse.json({
          success: true,
          isNewUser: true,
          user: result,
        })
      } else {
        serverLog('Existing user found, no settings changes needed:', userId)
        return NextResponse.json({
          success: true,
          isNewUser: false,
          isExistingUser: true,
          settings: result.settings,
        })
      }
    } else {
      serverError('User initialization failed with null result:', userId)
      return NextResponse.json(
        { error: 'Failed to initialize user' },
        { status: 500 }
      )
    }
  } catch (error) {
    serverError('User initialization failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
