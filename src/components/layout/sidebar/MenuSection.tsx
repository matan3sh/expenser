'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuSectionProps {
  title: string
  items: Array<{
    href: string
    icon: React.ElementType
    label: string
  }>
  onItemClick: (e: React.MouseEvent) => void
}

export function MenuSection({ title, items, onItemClick }: MenuSectionProps) {
  const pathname = usePathname()

  return (
    <div className="mb-6">
      <h4 className="px-2 mb-2 text-sm font-semibold text-muted-foreground">
        {title}
      </h4>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
