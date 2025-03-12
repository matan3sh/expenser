'use client'

import {
  DollarSign,
  HomeIcon,
  LineChart,
  Palette,
  PlusCircle,
  Settings,
  Upload,
} from 'lucide-react'
import React from 'react'
import { MenuItem } from './types'

const createIcon = (Icon: typeof HomeIcon) => {
  const IconComponent = () => <Icon className="h-4 w-4" />
  IconComponent.displayName = `${Icon.name}Icon`
  return IconComponent
}

export const mainMenuItems: MenuItem[] = [
  { href: '/', icon: createIcon(HomeIcon), label: 'Dashboard' },
  { href: '/expenses', icon: createIcon(DollarSign), label: 'Expenses' },
  { href: '/analytics', icon: createIcon(LineChart), label: 'Analytics' },
  { href: '/categories', icon: createIcon(Palette), label: 'Categories' },
  { href: '/settings', icon: createIcon(Settings), label: 'Settings' },
]

export const actionMenuItems: MenuItem[] = [
  { href: '/add-expense', icon: createIcon(PlusCircle), label: 'Add Expense' },
  {
    href: '/upload-receipt',
    icon: createIcon(Upload),
    label: 'Upload Receipt',
  },
]
