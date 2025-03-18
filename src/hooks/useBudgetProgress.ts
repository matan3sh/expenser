import { useSettings } from '@/contexts/SettingsContext'

export function useBudgetProgress(totalAmount: number, budget: number) {
  const { settings, convertAmount } = useSettings()
  const displayCurrency = settings?.displayCurrency?.code || 'USD'

  // Convert budget to display currency if needed
  const convertedBudget = convertAmount(budget, displayCurrency)
  const convertedTotal = convertAmount(totalAmount, displayCurrency)

  const progressPercentage = (convertedTotal / convertedBudget) * 100
  const remaining = convertedBudget - convertedTotal

  // Rest of your logic for determining colors and status...

  return {
    progressPercentage,
    progressColor,
    status,
    remaining,
  }
}
