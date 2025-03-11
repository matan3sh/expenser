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
import { Currency, currencies as currencyData } from '@/data/currencies'

export function CurrencySettings() {
  const { settings, updateCurrency } = useSettings()

  const handleCurrencyChange = (code: string) => {
    const selectedCurrency = currencyData.find((c: Currency) => c.code === code)
    if (selectedCurrency) {
      updateCurrency({
        label: `${selectedCurrency.code} - ${selectedCurrency.name}`,
        value: selectedCurrency.code,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency</CardTitle>
        <CardDescription>
          Choose your preferred currency for displaying expenses
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <Select
            value={settings.currency.value}
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyData.map((currency) => (
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
