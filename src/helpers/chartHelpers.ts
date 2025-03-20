import { Settings } from '@/contexts/SettingsContext'

export const CHART_COLORS = {
  day: [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--info))',
    'hsl(var(--error))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
  ],
  location: [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--info))',
    'hsl(var(--success))',
  ],
}

export const formatCurrency = (settings: Settings, value: number) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: settings?.displayCurrency?.code || 'USD',
  }).format(value)
}
