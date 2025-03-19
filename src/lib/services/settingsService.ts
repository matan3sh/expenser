import type { Settings } from '@/contexts/SettingsContext'

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
    if (
      !this.settings.displayCurrency?.code ||
      fromCurrency === this.settings.displayCurrency?.code
    ) {
      return amount
    }

    const rate = this.settings.exchangeRates[fromCurrency]
    if (!rate) {
      console.warn(`No exchange rate found for ${fromCurrency}`)
      return amount
    }

    return amount * rate
  }
}

export const settingsService = SettingsService.getInstance()
