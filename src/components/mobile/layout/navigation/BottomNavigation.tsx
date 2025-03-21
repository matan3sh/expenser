'use client'

import Spinner from '@/components/ui/spinner'
import { PlusIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { memo, useCallback, useState } from 'react'
import { ExpenseSheet } from '../expense/ExpenseSheet'
import { ReceiptUploadSheet } from '../expense/ReceiptUploadSheet'
import { useReceiptProcessor } from '../hooks/useReceiptProcessor'
import { FloatingActionButton } from './FloatingActionButton'
import { NavigationItem } from './NavigationItem'
import { backdropVariants, fabVariants } from './animations'
import { floatingActions, navigationItems } from './config'

export const BottomNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false)
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false)

  const {
    isProcessing,
    uploadInitialData,
    uploadError,
    fileInputRef,
    handleFileUpload,
    resetUpload,
    setUploadError,
  } = useReceiptProcessor()

  const toggleMenu = useCallback(() => {
    // Use RAF to ensure smooth state updates
    requestAnimationFrame(() => {
      setIsOpen((prev) => !prev)
    })
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Handler for upload button click
  const handleUploadButtonClick = () => {
    // Reset potential previous errors
    setUploadError(null)
    // Reset file input value to ensure the change event is triggered even if selecting the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    fileInputRef.current?.click()
    handleClose()
  }

  const handleRetry = () => {
    setIsUploadSheetOpen(false)
    // Small delay to ensure sheet is closed before opening again
    setTimeout(() => {
      handleUploadButtonClick()
    }, 300)
  }

  const handleAddManually = () => {
    setIsUploadSheetOpen(false)
    setIsExpenseSheetOpen(true)
  }

  // Create a modified version of floatingActions with the correct onClick handlers
  const actions = floatingActions.map((action) => {
    if (action.name === 'Add') {
      return {
        ...action,
        onClick: () => {
          setIsExpenseSheetOpen(true)
          handleClose()
        },
      }
    }
    if (action.name === 'Upload') {
      return {
        ...action,
        href: '#',
        onClick: handleUploadButtonClick,
      }
    }
    return action
  })

  // Handle successful file upload
  const onFileProcessed = async (file: File) => {
    try {
      await handleFileUpload(file)
      setIsUploadSheetOpen(true)
    } catch {
      // Error is already handled in handleFileUpload
      setIsUploadSheetOpen(true)
    }
  }

  return (
    <>
      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileProcessed(file)
        }}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {isOpen && (
          <div className="fixed bottom-[104px] left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-3 items-center">
            {actions.map((action, index) => (
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

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Spinner className="h-8 w-8" />
            <p className="mt-2 font-medium">Processing receipt...</p>
          </div>
        </div>
      )}

      {/* Expense Sheet */}
      <ExpenseSheet
        open={isExpenseSheetOpen}
        onOpenChange={setIsExpenseSheetOpen}
      />

      {/* Receipt Upload Sheet */}
      <ReceiptUploadSheet
        open={isUploadSheetOpen}
        onOpenChange={(open) => {
          setIsUploadSheetOpen(open)
          if (!open) resetUpload()
        }}
        uploadInitialData={uploadInitialData}
        uploadError={uploadError}
        onRetry={handleRetry}
        onAddManually={handleAddManually}
      />

      <nav className="fixed bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-md border-t border-border z-40 transform-gpu pb-safe">
        <div className="flex justify-around items-center h-16 relative">
          {navigationItems.map((item) => {
            if (item === null) {
              return (
                <button
                  key="fab"
                  onClick={toggleMenu}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 p-4 
                           rounded-full bg-primary text-white 
                           shadow-lg transform
                           ring-4 ring-background"
                >
                  <motion.div
                    variants={fabVariants}
                    animate={isOpen ? 'open' : 'closed'}
                  >
                    <PlusIcon className="w-6 h-6" />
                  </motion.div>
                </button>
              )
            }

            return <NavigationItem key={item.name} item={item} />
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
