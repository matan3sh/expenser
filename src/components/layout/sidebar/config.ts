import { MenuIcons } from './MenuIcons'
import { MenuItem } from './types'

export const mainMenuItems: MenuItem[] = [
  { href: '/', icon: MenuIcons.Home, label: 'Dashboard' },
  { href: '/expenses', icon: MenuIcons.Dollar, label: 'Expenses' },
  { href: '/analytics', icon: MenuIcons.Chart, label: 'Analytics' },
  { href: '/categories', icon: MenuIcons.Palette, label: 'Categories' },
  { href: '/settings', icon: MenuIcons.Settings, label: 'Settings' },
]

export const actionMenuItems: MenuItem[] = [
  { href: '/add-expense', icon: MenuIcons.Plus, label: 'Add Expense' },
  { href: '/upload-receipt', icon: MenuIcons.Upload, label: 'Upload Receipt' },
]
