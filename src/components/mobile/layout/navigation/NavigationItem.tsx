'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'

interface NavigationItemProps {
  item: {
    name: string
    href: string
    Icon: React.ComponentType<{ className?: string }>
  }
}

export const NavigationItem = memo(({ item }: NavigationItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center justify-center p-2',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <item.Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{item.name}</span>
    </Link>
  )
})

NavigationItem.displayName = 'NavigationItem'
