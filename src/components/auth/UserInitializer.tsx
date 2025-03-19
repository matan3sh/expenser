'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export function UserInitializer() {
  const { user, isLoaded } = useUser()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const initAttemptsRef = useRef(0)
  const MAX_RETRIES = 3
  const hasInitializedInSessionRef = useRef(false)

  useEffect(() => {
    // Skip initialization if we've already tried in this session
    if (hasInitializedInSessionRef.current) {
      return
    }

    const initUser = async () => {
      // Don't initialize if:
      // - User is not loaded yet
      // - User doesn't exist
      // - User is already initialized
      // - We're currently in the middle of initializing
      if (!user || isInitialized || isInitializing) return

      // Mark that we've attempted initialization in this session
      hasInitializedInSessionRef.current = true

      // Prevent concurrent initialization attempts
      setIsInitializing(true)

      try {
        console.log('Initializing user:', user.id)

        const response = await fetch('/api/auth/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })

        if (!response.ok) {
          const data = await response
            .json()
            .catch(() => ({ error: 'Unknown error' }))
          throw new Error(data.error || response.statusText)
        }

        const data = await response.json().catch(() => null)

        if (data?.success) {
          console.log('User initialized successfully')
          setIsInitialized(true)
          initAttemptsRef.current = 0
          setIsInitializing(false)

          // If this was a new user, no need to reload since default settings are applied
          if (data.isNewUser) {
            console.log('New user created with default settings')
          } else {
            console.log('Existing user, no settings changes needed')
          }
        } else {
          throw new Error('User initialization returned an invalid response')
        }
      } catch (error) {
        console.error('Failed to initialize user:', error)

        // If we've tried too many times, stop trying
        if (initAttemptsRef.current >= MAX_RETRIES) {
          toast.error('Failed to initialize user. Please refresh the page.')
          setIsInitializing(false)
          return
        }

        // Increment retry attempts and try again after a delay
        initAttemptsRef.current++

        // Use exponential backoff (1s, 2s, 4s)
        const retryDelay = Math.pow(2, initAttemptsRef.current - 1) * 1000

        console.log(
          `Retrying initialization in ${retryDelay}ms (attempt ${initAttemptsRef.current})`
        )

        // Set a timeout to retry
        setTimeout(() => {
          setIsInitializing(false)
          // Allow another initialization attempt
          hasInitializedInSessionRef.current = false
        }, retryDelay)
      }
    }

    if (isLoaded) {
      initUser()
    }
  }, [user, isLoaded, isInitialized, isInitializing])

  return null
}
