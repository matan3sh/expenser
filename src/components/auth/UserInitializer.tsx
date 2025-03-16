'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export function UserInitializer() {
  const { user, isLoaded } = useUser()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initUser = async () => {
      if (!user || isInitialized) return

      try {
        const response = await fetch('/api/auth/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error)
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize user:', error)
        // You could add toast notification here
      }
    }

    if (isLoaded) {
      initUser()
    }
  }, [user, isLoaded, isInitialized])

  return null
}
