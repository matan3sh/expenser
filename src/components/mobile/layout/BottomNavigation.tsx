'use client'

import {
  ArrowUpTrayIcon,
  BanknotesIcon,
  CameraIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useMemo, useState } from 'react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    Icon: HomeIcon,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    Icon: ChartBarIcon,
  },
  null, // Center placeholder for FAB
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

const floatingActions = [
  {
    name: 'Add Expense',
    href: '/add-expense',
    Icon: BanknotesIcon,
    color: 'bg-primary',
  },
  {
    name: 'Upload Receipt',
    href: '/upload-receipt',
    Icon: ArrowUpTrayIcon,
    color: 'bg-primary',
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

// Pre-define animation variants outside component to prevent recreation
const floatingButtonVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      delay: index * 0.02, // Reduced delay
      type: 'spring',
      stiffness: 600, // Increased stiffness
      damping: 35,
      mass: 0.5, // Added lower mass for snappier animation
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    y: 10,
    scale: 0.8,
    transition: {
      duration: 0.1,
      delay: index * 0.02,
    },
  }),
}

const labelVariants = {
  hidden: { x: 10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.1 },
  },
  exit: {
    x: 10,
    opacity: 0,
    transition: { duration: 0.1 },
  },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.3,
    transition: { duration: 0.15 },
  },
}

const fabVariants = {
  closed: { rotate: 0, scale: 1 },
  open: {
    rotate: 45,
    scale: 1.1,
    transition: { duration: 0.2, type: 'spring', stiffness: 500 },
  },
}

// Optimize FloatingActionButton with better performance
const FloatingActionButton = memo(
  ({
    action,
    index,
    onClose,
  }: {
    action: (typeof floatingActions)[0]
    index: number
    onClose: () => void
  }) => (
    <motion.div
      custom={index}
      variants={floatingButtonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={false} // Disable layout animations
      layoutId={`fab-${action.name}`} // Add layoutId for better transitions
    >
      <Link
        href={action.href}
        onClick={(e) => {
          if (action.onClick) {
            e.preventDefault()
            action.onClick()
          }
          onClose()
        }}
        className="flex items-center gap-3 group"
      >
        <motion.span
          variants={labelVariants}
          className="bg-white/90 text-sm font-medium px-4 py-2 rounded-full shadow-lg
                 backdrop-blur-sm border border-white/10
                 transition-colors duration-200
                 group-hover:bg-white group-hover:shadow-xl"
        >
          {action.name}
        </motion.span>
        <div
          className={`${action.color} text-white p-3.5 rounded-full 
                   shadow-lg transform-gpu will-change-transform
                   hover:shadow-xl hover:scale-110 active:scale-95
                   ring-4 ring-white/10`}
        >
          <action.Icon className="w-6 h-6" />
        </div>
      </Link>
    </motion.div>
  )
)

FloatingActionButton.displayName = 'FloatingActionButton'

const NavigationItem = memo(
  ({
    item,
    isActive,
  }: {
    item: (typeof navigationItems)[0]
    isActive: boolean
  }) => {
    if (!item) return null

    return (
      <Link
        href={item.href}
        className={`flex flex-col items-center justify-center w-full h-full 
                 transition-colors duration-200
                 ${
                   isActive
                     ? 'text-primary'
                     : 'text-muted-foreground hover:text-primary/80'
                 }`}
      >
        <item.Icon className="w-6 h-6" />
        <span className="text-xs mt-1">{item.name}</span>
      </Link>
    )
  }
)

NavigationItem.displayName = 'NavigationItem'

export const BottomNavigation = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const toggleMenu = useCallback(() => {
    // Use RAF to ensure smooth state updates
    requestAnimationFrame(() => {
      setIsOpen((prev) => !prev)
    })
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Optimize rendering with transition settings based on reduced motion preference
  const transition = useMemo(
    () => ({
      duration: prefersReducedMotion ? 0.1 : 0.15,
      type: 'spring',
      stiffness: 600,
      damping: 35,
      mass: 0.5,
    }),
    [prefersReducedMotion]
  )

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {' '}
        {/* Changed to sync mode */}
        {isOpen && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-3 items-center">
            {floatingActions.map((action, index) => (
              <FloatingActionButton
                key={action.name}
                action={action}
                index={index}
                onClose={handleClose}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 w-full bg-background/80 backdrop-blur-md border-t border-border lg:hidden z-40 transform-gpu">
        <div className="flex justify-around items-center h-16 relative">
          {navigationItems.map((item) => {
            if (item === null) {
              return (
                <button
                  key="fab"
                  onClick={toggleMenu}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 p-4 
                           rounded-full bg-primary text-white 
                           shadow-lg transform transition-all duration-200 
                           hover:shadow-xl hover:scale-110 active:scale-95
                           ring-4 ring-background"
                >
                  <motion.div
                    variants={fabVariants}
                    animate={isOpen ? 'open' : 'closed'}
                    transition={transition}
                  >
                    <PlusIcon className="w-6 h-6" />
                  </motion.div>
                </button>
              )
            }

            return (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={pathname === item.href}
              />
            )
          })}
        </div>
      </nav>
    </>
  )
}

// Export with memo and displayName for better debugging
const MemoizedBottomNavigation = memo(BottomNavigation)
MemoizedBottomNavigation.displayName = 'BottomNavigation'
export default MemoizedBottomNavigation
