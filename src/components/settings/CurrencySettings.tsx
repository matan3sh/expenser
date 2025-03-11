'use client'

import { ExchangeRatesDialog } from '@/components/settings/ExchangeRatesDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettings } from '@/contexts/SettingsContext'
import { currencies } from '@/data/currencies'
import { useExchangeRates } from '@/hooks/useExchangeRates'
import { Info } from 'lucide-react'

export function CurrencySettings() {
  const { settings, updateDisplayCurrency } = useSettings()

  // Custom hook to handle exchange rates fetching
  useExchangeRates(settings?.displayCurrency?.code)

  const handleCurrencyChange = (code: string) => {
    const currency = currencies.find((c) => c.code === code)
    if (currency) {
      updateDisplayCurrency({
        code: currency.code,
        name: currency.name,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Currency</CardTitle>
        <CardDescription>
          Set your preferred currency for displaying expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="displayCurrency">Display Currency</Label>
            <ExchangeRatesDialog
              trigger={
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              }
            />
          </div>
          <Select
            value={settings?.displayCurrency?.code || 'USD'}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select display currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {`${currency.code} - ${currency.name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
