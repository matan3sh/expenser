'use client'

import { SheetFooter } from '@/components/ui/sheet'
import { memo } from 'react'

interface ReceiptFooterProps {
  totalAmount: number
  itemCount: number
  formatAmount: (amount: number, currency?: string) => string
  displayCurrency?: string
}

const ReceiptFooter = ({
  totalAmount,
  itemCount,
  formatAmount,
  displayCurrency = 'USD',
}: ReceiptFooterProps) => {
  return (
    <SheetFooter className="border-t border-dashed border-gray-200 py-4 px-6 sticky bottom-0 bg-white shadow-lg">
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-gray-500">Total Items</div>
          <div className="font-medium">{itemCount}</div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <div className="text-base font-semibold text-gray-700">TOTAL</div>
          <div className="text-xl font-bold font-mono text-gray-900">
            {formatAmount(totalAmount, displayCurrency)}
          </div>
        </div>
      </div>
    </SheetFooter>
  )
}

export default memo(ReceiptFooter)
