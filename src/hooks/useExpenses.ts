'use client'

import { useEffect, useState } from 'react'

interface Expense {
  id: string
  amount: number
  currency: string
  date: string
  location?: string
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    // For now, let's use some sample data
    // Later you can replace this with actual data fetching from your backend
    const sampleData: Expense[] = [
      {
        id: '1',
        amount: 50,
        currency: 'USD',
        date: new Date().toISOString(),
        location: 'Grocery Store',
      },
      {
        id: '2',
        amount: 30,
        currency: 'USD',
        date: new Date().toISOString(),
        location: 'Restaurant',
      },
      {
        id: '3',
        amount: 20,
        currency: 'USD',
        date: new Date().toISOString(),
        location: 'Coffee Shop',
      },
    ]

    setExpenses(sampleData)
  }, [])

  return { expenses }
}
