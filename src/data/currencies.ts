export interface Currency {
  code: string
  name: string
  symbol: string
  decimal_digits: number
  format: string // {symbol}{amount} or {amount}{symbol}
}

export const currencies: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimal_digits: 2,
    format: '{symbol}{amount}',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimal_digits: 2,
    format: '{symbol}{amount}',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimal_digits: 2,
    format: '{symbol}{amount}',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    decimal_digits: 0,
    format: '{symbol}{amount}',
  },
  {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
    decimal_digits: 2,
    format: '{symbol}{amount}',
  },
]

// Helper function to format amount based on currency
export function formatCurrency(
  amount: number,
  currencyCode: string = 'USD'
): string {
  const currency =
    currencies.find((c) => c.code === currencyCode) || currencies[0]
  const formattedAmount = amount.toFixed(currency.decimal_digits)
  return currency.format
    .replace('{symbol}', currency.symbol)
    .replace('{amount}', formattedAmount)
}

// Helper function to get currency by code
export function getCurrencyByCode(code: string): Currency | undefined {
  return currencies.find((currency) => currency.code === code)
}
