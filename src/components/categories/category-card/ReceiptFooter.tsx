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
    <SheetFooter className="border-t border-dashed border-border py-4 px-6 sticky bottom-0 bg-card shadow-lg">
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-muted-foreground">Total Items</div>
          <div className="font-medium">{itemCount}</div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="text-base font-semibold text-foreground">TOTAL</div>
          <div className="text-xl font-bold font-mono text-foreground">
            {formatAmount(totalAmount, displayCurrency)}
          </div>
        </div>
      </div>
    </SheetFooter>
  )
}

export default memo(ReceiptFooter)
