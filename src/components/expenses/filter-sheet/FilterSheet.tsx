'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { categories } from '@/data/categories'
import { useState } from 'react'

interface FilterSheetProps {
  open: boolean
  filters: {
    category?: string
    startDate?: string
    endDate?: string
    minAmount?: number
    maxAmount?: number
    sort?: string
  }
  onClose: () => void
  onApply: (filters: FilterSheetProps['filters']) => void
  onReset: () => void
}

export function FilterSheet({
  open,
  filters: initialFilters,
  onClose,
  onApply,
  onReset,
}: FilterSheetProps) {
  const [filters, setFilters] = useState(initialFilters)
  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        className="w-full sm:w-[540px] overflow-y-auto p-0"
        side="right"
      >
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="text-2xl font-bold">
            Filter Expenses
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 pt-2 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Amount Range</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minAmount || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxAmount || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxAmount: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Sort By</label>
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilters({ ...filters, sort: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="amount_high">Highest Amount</SelectItem>
                <SelectItem value="amount_low">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 pt-2">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={hasActiveFilters ? onReset : onClose}
            >
              {hasActiveFilters ? 'Reset' : 'Cancel'}
            </Button>
            <Button className="flex-1" onClick={() => onApply(filters)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
