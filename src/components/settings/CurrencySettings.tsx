'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSettings } from '@/contexts/SettingsContext'
import { currencies, formatCurrency } from '@/data/currencies'
import { Info } from 'lucide-react'
import { useEffect } from 'react'

export function CurrencySettings() {
  const { settings, updateDisplayCurrency, updateExchangeRates } = useSettings()

  useEffect(() => {
    const fetchExchangeRates = async (displayCurrency: string) => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${displayCurrency}`
        )
        const data = await response.json()
        updateExchangeRates(data.rates)
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }

    if (settings?.displayCurrency?.code) {
      fetchExchangeRates(settings.displayCurrency.code)
    }
  }, [settings?.displayCurrency?.code, updateExchangeRates])

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader className="pb-4 border-b">
                  <DialogTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <span>Live Exchange Rates</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-full">
                      <span className="text-sm font-semibold">
                        {settings?.displayCurrency?.code}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {settings?.displayCurrency?.name}
                      </span>
                    </div>
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    All expenses will be converted using these rates
                  </p>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pr-4 max-h-[60vh] overflow-y-auto">
                  {settings?.exchangeRates &&
                    Object.entries(settings.exchangeRates)
                      .filter(
                        ([code]) => code !== settings?.displayCurrency?.code
                      )
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .map(([code, rate]) => {
                        const currency = currencies.find((c) => c.code === code)
                        return (
                          <div
                            key={code}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-base">
                                  {code}
                                </span>
                                <span className="px-2 py-0.5 text-xs bg-background rounded-full">
                                  {formatCurrency(1, code)}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {currency?.name}
                              </span>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="font-mono font-medium">
                                {formatCurrency(
                                  rate,
                                  settings?.displayCurrency?.code || 'USD'
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                per unit
                              </span>
                            </div>
                          </div>
                        )
                      })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Select
            value={settings?.displayCurrency?.code || 'USD'}
            onValueChange={(code) => {
              const currency = currencies.find((c) => c.code === code)
              if (currency) {
                updateDisplayCurrency({
                  code: currency.code,
                  name: currency.name,
                })
              }
            }}
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
