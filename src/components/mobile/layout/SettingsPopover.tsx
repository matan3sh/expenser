'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useSettings } from '@/contexts/SettingsContext'
import { currencies } from '@/data/currencies'
import { useEffect, useState } from 'react'

interface SettingsPopoverProps {
  children: React.ReactNode
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
  children,
}) => {
  const { settings, updateDisplayCurrency, updateTheme, updateUseGeminiAI } =
    useSettings()

  const [localSettings, setLocalSettings] = useState(settings)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setLocalSettings({ ...settings })
    }
  }, [open, settings])

  const handleCurrencyChange = (currency: string) => {
    const selectedCurrency = currencies.find((c) => c.code === currency)
    if (selectedCurrency) {
      setLocalSettings((prev) => ({
        ...prev,
        displayCurrency: {
          code: selectedCurrency.code,
          name: selectedCurrency.name,
          symbol: selectedCurrency.symbol,
        },
      }))
    }
  }

  const handleThemeChange = (theme: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      theme: theme as 'light' | 'dark' | 'system',
    }))
  }

  const handleGeminiChange = (enabled: boolean) => {
    setLocalSettings((prev) => ({
      ...prev,
      useGeminiAI: enabled,
    }))
  }

  const handleUpdate = () => {
    if (
      localSettings.displayCurrency &&
      localSettings.displayCurrency.code !== settings.displayCurrency?.code
    ) {
      updateDisplayCurrency(localSettings.displayCurrency)
    }

    if (localSettings.theme !== settings.theme) {
      updateTheme(localSettings.theme)
    }

    if (localSettings.useGeminiAI !== settings.useGeminiAI) {
      updateUseGeminiAI(localSettings.useGeminiAI)
    }

    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        align="center"
        side="bottom"
        sideOffset={10}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Settings</h3>

          {/* Currency Setting */}
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm font-medium">
              Currency
            </Label>
            <Select
              value={localSettings.displayCurrency?.code || 'USD'}
              onValueChange={(value) => handleCurrencyChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} ({c.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Setting */}
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-sm font-medium">
              Theme
            </Label>
            <Select
              value={localSettings.theme || 'system'}
              onValueChange={(value) => handleThemeChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gemini Processing Switch */}
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="gemini-processing" className="text-sm font-medium">
              Gemini Processing
            </Label>
            <Switch
              id="gemini-processing"
              checked={localSettings.useGeminiAI}
              onCheckedChange={handleGeminiChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
