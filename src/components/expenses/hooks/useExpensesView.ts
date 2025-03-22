'use client'

import { Expense } from '@/types/expense.types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Filters {
  query?: string
  category?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  sort?: string
}

export function useExpensesView(initialExpenses: {
  expenses: Expense[]
  totalPages: number
  totalExpenses: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Local state
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [expenses, setExpenses] = useState(initialExpenses.expenses)
  const [totalPages, setTotalPages] = useState(initialExpenses.totalPages)

  // Get current filters from URL
  const filters: Filters = {
    query: searchParams.get('query') || undefined,
    category: searchParams.get('category') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    minAmount: searchParams.get('minAmount')
      ? Number(searchParams.get('minAmount'))
      : undefined,
    maxAmount: searchParams.get('maxAmount')
      ? Number(searchParams.get('maxAmount'))
      : undefined,
    sort: searchParams.get('sort') || undefined,
  }

  const page = Number(searchParams.get('page')) || 1

  // Update URL helper function
  const updateUrl = useCallback(
    (newParams: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Update or remove parameters
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateUrl({
        query: e.target.value,
        page: '1', // Reset to first page on search
      })
    },
    [updateUrl]
  )

  const handleFilterClick = () => setIsFilterSheetOpen(true)
  const handleFilterClose = () => setIsFilterSheetOpen(false)

  const handleFilterApply = (newFilters: Filters) => {
    const filterParams: Record<string, string> = {}

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        filterParams[key] = String(value)
      }
    })

    updateUrl({
      ...filterParams,
      page: '1', // Reset to first page on filter
    })
    setIsFilterSheetOpen(false)
  }

  const handleFilterReset = () => {
    router.push(window.location.pathname)
    setIsFilterSheetOpen(false)
  }

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: String(newPage) })
  }

  // Update local state when URL params change
  useEffect(() => {
    setExpenses(initialExpenses.expenses)
    setTotalPages(initialExpenses.totalPages)
  }, [initialExpenses])

  return {
    filters,
    isFilterSheetOpen,
    page,
    expenses,
    totalPages,
    handleSearchChange,
    handleFilterClick,
    handleFilterClose,
    handleFilterApply,
    handleFilterReset,
    handlePageChange,
  }
}
