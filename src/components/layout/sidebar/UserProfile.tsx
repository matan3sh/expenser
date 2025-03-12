'use client'

import { UserProfileSkeleton } from '@/components/skeletons/UserProfileSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserProfileProps } from './types'

export function UserProfile({ user, isLoaded }: UserProfileProps) {
  if (!isLoaded) {
    return <UserProfileSkeleton />
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        {user ? (
          <>
            <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
            <AvatarFallback>
              {user.firstName?.[0] ||
                user.emailAddresses?.[0]?.emailAddress?.[0] ||
                '?'}
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback>?</AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium">
          {user ? user.fullName || 'User' : 'Guest User'}
        </span>
        <span className="text-xs text-muted-foreground">
          {user ? user.emailAddresses?.[0]?.emailAddress : 'Not signed in'}
        </span>
      </div>
    </div>
  )
}
