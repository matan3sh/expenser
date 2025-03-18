'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency } from '@/data/currencies'

interface ExpenseAmountProps {
  amount: number
  currency: string
  className?: string
  originalAmountClassName?: string
}

export function ExpenseAmount({
  amount,
  currency,
  className = 'font-medium',
  originalAmountClassName = 'text-xs text-muted-foreground',
}: ExpenseAmountProps) {
  const { convertAmount, settings } = useSettings()
  const displayCurrency = settings?.displayCurrency?.code

  if (!displayCurrency) {
    return <div className={className}>{formatCurrency(amount, currency)}</div>
  }

  const convertedAmount = convertAmount(amount, currency)
  const formattedDisplayAmount = formatCurrency(
    convertedAmount,
    displayCurrency
  )
  const formattedOriginalAmount = formatCurrency(amount, currency)
  const showOriginal = displayCurrency !== currency

  return (
    <div className="text-right">
      <div className={className}>{formattedDisplayAmount}</div>
      {showOriginal && (
        <div className={originalAmountClassName}>
          ({formattedOriginalAmount})
        </div>
      )}
    </div>
  )
}
