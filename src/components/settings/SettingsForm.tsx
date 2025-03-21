'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { currencies } from '@/data/currencies'
import { useEffect, useState } from 'react'

interface SettingsFormProps {
  settings: any // Replace with your actual settings type
  onChange: (settings: any) => void
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  settings,
  onChange,
}) => {
  // Create local state for form values
  const [formValues, setFormValues] = useState(settings)

  // Update local state when settings prop changes
  useEffect(() => {
    setFormValues(settings)
  }, [settings])

  const handleChange = (key: string, value: any) => {
    const newFormValues = {
      ...formValues,
      [key]: value,
    }
    setFormValues(newFormValues)
    onChange(newFormValues)
  }

  return (
    <div className="space-y-4">
      {/* Currency settings */}
      <div className="space-y-2">
        <Label htmlFor="displayCurrency">Display Currency</Label>
        <Select
          value={formValues.displayCurrency?.code || 'USD'}
          onValueChange={(value) =>
            handleChange(
              'displayCurrency',
              currencies.find((c) => c.code === value) || {
                code: 'USD',
                symbol: '$',
              }
            )
          }
        >
          <SelectTrigger id="displayCurrency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} ({currency.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dark mode toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="darkMode">Dark Mode</Label>
        <Switch
          id="darkMode"
          checked={formValues.darkMode || false}
          onCheckedChange={(checked) => handleChange('darkMode', checked)}
        />
      </div>

      {/* Notifications toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Notifications</Label>
        <Switch
          id="notifications"
          checked={formValues.notifications || false}
          onCheckedChange={(checked) => handleChange('notifications', checked)}
        />
      </div>

      {/* Add more settings as needed */}
    </div>
  )
}
