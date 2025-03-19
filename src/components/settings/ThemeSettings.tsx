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
import { useTheme } from 'next-themes'

export function ThemeSettings() {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme()
  const { settings, updateTheme } = useSettings()

  // Handle theme change and ensure it's synced with both systems
  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    // Update next-themes for UI
    setNextTheme(value)

    // Update our settings context to sync with DB
    updateTheme(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Customize the appearance of the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="theme">Color Theme</Label>
          <Select
            value={nextTheme || settings.theme}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
