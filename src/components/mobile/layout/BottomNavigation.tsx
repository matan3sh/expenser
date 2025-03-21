'use client'

import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import Spinner from '@/components/ui/spinner'
import { useSettings } from '@/contexts/SettingsContext'
import {
  GEMINI_PROMPT,
  cleanGeminiResponse,
  convertImageToBase64,
  extractReceiptData,
  prepareImageData,
  validateAndFormatData,
} from '@/helpers/receipt'
import { cn } from '@/lib/utils'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  ArrowUpTrayIcon,
  BanknotesIcon,
  CameraIcon,
  ChartBarIcon,
  HomeIcon,
  PlusIcon,
  TagIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'

const navigationItems = [
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

const floatingActions = [
  {
    name: 'Add',
    href: '#',
    Icon: BanknotesIcon,
    color: 'bg-primary',
    onClick: undefined,
  },
  {
    name: 'Upload',
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
      delay: index * 0.02,
      type: 'spring',
      stiffness: 600,
      damping: 35,
      mass: 0.5,
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

interface NavigationItemProps {
  item: {
    name: string
    href: string
    Icon: React.ComponentType<{ className?: string }>
  }
}

export const NavigationItem = ({ item }: NavigationItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        'flex flex-col items-center justify-center p-2',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      )}
    >
      <item.Icon className="w-6 h-6" />
      <span className="text-xs mt-1">{item.name}</span>
    </Link>
  )
}

interface UploadData {
  amount?: number
  currency?: string
  date?: string
  description?: string
  location?: string
  category?: string
}

export const BottomNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false)
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadInitialData, setUploadInitialData] = useState<
    UploadData | undefined
  >(undefined)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { settings } = useSettings()

  const toggleMenu = useCallback(() => {
    // Use RAF to ensure smooth state updates
    requestAnimationFrame(() => {
      setIsOpen((prev) => !prev)
    })
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Process receipt using Gemini AI
  const processWithGeminiAI = async (file: File) => {
    const base64Image = await convertImageToBase64(file)
    const imageData = prepareImageData(base64Image, file.type)

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!
    )
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent([GEMINI_PROMPT, imageData])
    const response = await result.response
    const text = response.text()

    const cleanedResponse = cleanGeminiResponse(text)
    const parsedData = JSON.parse(cleanedResponse)
    const processedData = validateAndFormatData(parsedData)

    return {
      amount: processedData.amount,
      currency: processedData.currency,
      date: processedData.date,
      description: processedData.description,
      location: processedData.location,
    }
  }

  // Process receipt using Tesseract.js
  const processWithTesseract = async (file: File) => {
    const worker = await createWorker('eng')
    const {
      data: { text },
    } = await worker.recognize(file)
    await worker.terminate()

    const extractedData = extractReceiptData(text)
    console.log('Tesseract extracted data:', extractedData)

    if (!extractedData.amount) {
      throw new Error('Could not extract amount from receipt')
    }

    return {
      amount: extractedData.amount,
      currency: extractedData.currency,
      date: extractedData.date || new Date().toISOString().split('T')[0],
      description: extractedData.description || 'Receipt expense',
      location: extractedData.location || 'Unknown location',
    }
  }

  // File upload handler
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      setUploadError(null)

      const params = await (settings?.useGeminiAI
        ? processWithGeminiAI(file)
        : processWithTesseract(file))

      console.log('Processed params:', params)
      setUploadInitialData(params)
      setIsUploadSheetOpen(true)
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : 'Failed to process receipt'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  // Handler for upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
    handleClose()
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
          if (file) handleFileUpload(file)
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
      <Sheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
        <SheetContent
          className="w-full sm:w-[540px] overflow-y-auto p-0"
          side="right"
        >
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-2xl font-bold">Add Expense</SheetTitle>
          </SheetHeader>
          <div className="p-6 pt-2">
            <ExpenseForm
              onSuccess={() => setIsExpenseSheetOpen(false)}
              onCancel={() => setIsExpenseSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Upload Sheet */}
      <Sheet
        open={isUploadSheetOpen}
        onOpenChange={(open) => {
          setIsUploadSheetOpen(open)
          if (!open) setUploadInitialData(undefined)
        }}
      >
        <SheetContent
          className="w-full sm:w-[540px] overflow-y-auto p-0"
          side="right"
        >
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-2xl font-bold">Receipt Data</SheetTitle>
          </SheetHeader>
          <div className="p-6 pt-2">
            {uploadError ? (
              <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-4">
                {uploadError}
              </div>
            ) : (
              <ExpenseForm
                initialData={uploadInitialData}
                onSuccess={() => setIsUploadSheetOpen(false)}
                onCancel={() => setIsUploadSheetOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

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
