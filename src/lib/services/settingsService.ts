import { convertSimpleAmount } from '@/lib/utils/expense.utils'
import { Settings } from '../../types/settings.types'

class SettingsService {
  private static instance: SettingsService
  private settings: Settings = {
    displayCurrency: { code: 'USD', name: 'US Dollar', symbol: '$' },
    exchangeRates: { USD: 1, ILS: 3.6 },
    theme: 'system',
    selectedMonth: {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    },
    useGeminiAI: true,
  }

  private constructor() {}

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService()
    }
    return SettingsService.instance
  }

  public updateSettings(settings: Settings) {
    this.settings = settings
  }

  public getSettings(): Settings {
    return this.settings
  }

  public convertAmount(amount: number, fromCurrency: string): number {
    return convertSimpleAmount(
      amount,
      fromCurrency,
      {
        displayCurrency: this.settings.displayCurrency,
        theme: this.settings.theme,
        selectedMonth: this.settings.selectedMonth,
        useGeminiAI: this.settings.useGeminiAI,
      },
      this.settings.exchangeRates
    )
  }
}

export const settingsService = SettingsService.getInstance()
