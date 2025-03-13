'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MenuSectionProps } from './types'

export function MenuSection({ title, items, onItemClick }: MenuSectionProps) {
  return (
    <div className="mb-4">
      <span className="text-xs font-medium mb-2 block text-muted-foreground">
        {title}
      </span>
      <div className="space-y-1">
        {items.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href} onClick={onItemClick}>
              <span className="mr-2">{item.icon()}</span>
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
