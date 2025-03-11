import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSettings } from '@/contexts/SettingsContext'
import { currencies, formatCurrency } from '@/data/currencies'
import { Info } from 'lucide-react'
import { ReactNode } from 'react'

interface ExchangeRatesDialogProps {
  trigger: ReactNode
}

export function ExchangeRatesDialog({ trigger }: ExchangeRatesDialogProps) {
  const { settings } = useSettings()

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              <span>Live Exchange Rates</span>
            </div>
            <CurrencyBadge
              code={settings?.displayCurrency?.code}
              name={settings?.displayCurrency?.name}
            />
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            All expenses will be converted using these rates
          </p>
        </DialogHeader>
        <ExchangeRatesList
          rates={settings?.exchangeRates}
          displayCurrency={settings?.displayCurrency?.code}
        />
      </DialogContent>
    </Dialog>
  )
}

function CurrencyBadge({ code, name }: { code?: string; name?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full">
      <span className="text-sm font-semibold">{code}</span>
      <span className="text-sm text-muted-foreground">{name}</span>
    </div>
  )
}

function ExchangeRatesList({
  rates,
  displayCurrency,
}: {
  rates?: Record<string, number>
  displayCurrency?: string
}) {
  if (!rates || !displayCurrency) return null

  const sortedRates = Object.entries(rates)
    .filter(([code]) => code !== displayCurrency)
    .sort((a, b) => a[0].localeCompare(b[0]))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pr-4 max-h-[60vh] overflow-y-auto">
      {sortedRates.map(([code, rate]) => (
        <ExchangeRateCard
          key={code}
          code={code}
          rate={rate}
          displayCurrency={displayCurrency}
        />
      ))}
    </div>
  )
}

function ExchangeRateCard({
  code,
  rate,
  displayCurrency,
}: {
  code: string
  rate: number
  displayCurrency: string
}) {
  const currency = currencies.find((c) => c.code === code)

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-accent/50 transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base">{code}</span>
          <span className="px-2 py-0.5 text-xs bg-background rounded-full">
            {formatCurrency(1, code)}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">{currency?.name}</span>
      </div>
      <div className="flex flex-col items-end">
        <div className="font-mono font-medium">
          {formatCurrency(rate, displayCurrency)}
        </div>
        <span className="text-xs text-muted-foreground">per unit</span>
      </div>
    </div>
  )
}
