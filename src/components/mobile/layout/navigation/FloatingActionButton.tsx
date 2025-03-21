'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { memo } from 'react'
import { floatingButtonVariants } from './animations'
import { floatingActions } from './config'

interface FloatingActionButtonProps {
  action: (typeof floatingActions)[0]
  index: number
  onClose: () => void
}

export const FloatingActionButton = memo(
  ({ action, index, onClose }: FloatingActionButtonProps) => (
    <motion.div
      custom={index}
      variants={floatingButtonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout={false}
      layoutId={`fab-${action.name}`}
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
        <div
          className={`${action.color} text-white p-3.5 rounded-full 
                     shadow-lg transform-gpu will-change-transform
                     ring-4 ring-white/10`}
        >
          <action.Icon className="w-6 h-6" />
        </div>
      </Link>
    </motion.div>
  )
)

FloatingActionButton.displayName = 'FloatingActionButton'
