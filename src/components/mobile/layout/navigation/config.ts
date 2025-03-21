import {
  ArrowUpTrayIcon,
  BanknotesIcon,
  CameraIcon,
  ChartBarIcon,
  HomeIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

export const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    Icon: HomeIcon,
  },
  {
    name: 'Planner',
    href: '/categories',
    Icon: TagIcon,
  },
  null, // Center placeholder for FAB
  {
    name: 'Expenses',
    href: '/expenses',
    Icon: BanknotesIcon,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    Icon: ChartBarIcon,
  },
]

export const floatingActions = [
  {
    name: 'Add',
    href: '#',
    Icon: BanknotesIcon,
    color: 'bg-primary',
    onClick: undefined,
  },
  {
    name: 'Upload',
    href: '#',
    Icon: ArrowUpTrayIcon,
    color: 'bg-primary',
    onClick: undefined,
  },
  {
    name: 'Camera',
    href: '#',
    Icon: CameraIcon,
    color: 'bg-primary',
    onClick: () => {
      // Camera functionality will be added later
      console.log('Camera clicked')
    },
  },
]
