'use client'

import {
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    Icon: HomeIcon, // Note the capital 'I' in Icon
  },
  {
    name: 'Analytics',
    href: '/analytics',
    Icon: ChartBarIcon,
  },
  {
    name: 'Expenses',
    href: '/expenses',
    Icon: BanknotesIcon,
  },
  {
    name: 'Settings',
    href: '/settings',
    Icon: Cog6ToothIcon,
  },
]

export const BottomNavigation = () => {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 w-full bg-background border-t border-border lg:hidden">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map(({ name, href, Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={name}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
