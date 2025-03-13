import { UserResource } from '@clerk/types'
import { ReactNode } from 'react'

export interface SidebarProps {
  className?: string
  isOpen: boolean
  onClose?: () => void
}

export interface MenuItem {
  href: string
  icon: () => ReactNode
  label: string
}

export interface MonthSelectorProps {
  handleMonthChange: (direction: 'prev' | 'next') => void
  isCurrentMonth: () => boolean
  getFormattedDate: () => string
}

export interface MenuSectionProps {
  title: string
  items: MenuItem[]
}

export interface UserProfileProps {
  user: UserResource | null | undefined
  isLoaded: boolean
}
