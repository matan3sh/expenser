'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency, getCurrencyByCode } from '@/data/currencies'

interface ExpenseAmountProps {
  amount: number
  currency: string
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
  className?: string
  originalAmountClassName?: string
}

export function ExpenseAmount({
  amount,
  currency,
  converted,
  className = 'font-medium',
  originalAmountClassName = 'text-xs text-muted-foreground',
}: ExpenseAmountProps) {
  const { settings } = useSettings()
  const displayCurrency = settings?.displayCurrency?.code

  if (!displayCurrency) {
    return <div className={className}>{formatCurrency(amount, currency)}</div>
  }

  return (
    <div>
      <div className={className}>
        {getCurrencyByCode(currency)?.symbol}
        {amount.toFixed(2)}
      </div>
      {converted && (
        <div className={originalAmountClassName}>
          ({converted?.symbol}
          {converted?.amount.toFixed(2)})
        </div>
      )}
    </div>
  )
}
