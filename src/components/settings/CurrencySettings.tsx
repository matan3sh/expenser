'use client'

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
import { currencies, formatCurrency } from '@/data/currencies'
import { useEffect } from 'react'

export function CurrencySettings() {
  const {
    settings,
    updateSourceCurrency,
    updateTargetCurrency,
    updateExchangeRate,
  } = useSettings()

  const fetchExchangeRate = async (source: string, target: string) => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${source}`
      )
      const data = await response.json()
      const rate = data.rates[target]
      updateExchangeRate(rate)
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error)
    }
  }

  useEffect(() => {
    fetchExchangeRate(
      settings.sourceCurrency.code,
      settings.targetCurrency.code
    )
  }, [settings.sourceCurrency.code, settings.targetCurrency.code])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Conversion</CardTitle>
        <CardDescription>
          Set your currency conversion preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="sourceCurrency">Convert From</Label>
          <Select
            value={settings.sourceCurrency.code}
            onValueChange={(code) => {
              const currency = currencies.find((c) => c.code === code)
              if (currency) {
                updateSourceCurrency({
                  code: currency.code,
                  name: currency.name,
                })
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source currency" />
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

        <div className="space-y-2">
          <Label htmlFor="targetCurrency">Convert To</Label>
          <Select
            value={settings.targetCurrency.code}
            onValueChange={(code) => {
              const currency = currencies.find((c) => c.code === code)
              if (currency) {
                updateTargetCurrency({
                  code: currency.code,
                  name: currency.name,
                })
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target currency" />
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

        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm font-medium">Current Exchange Rate:</p>
          <p className="text-2xl font-bold mt-1">
            1 {settings.targetCurrency.code} ={' '}
            {formatCurrency(
              settings.exchangeRate,
              settings.sourceCurrency.code
            )}{' '}
            {settings.sourceCurrency.code}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Exchange rates are updated in real-time
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
