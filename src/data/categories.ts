export interface Category {
  id: string
  name: string
  description: string
  color: string // Hex color code
  icon: string // Lucide icon name
  budget: number // Added budget field
  createdAt: Date
  updatedAt: Date
}

export const categories: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    description: 'Food and household items',
    color: 'var(--chart-1)',
    icon: 'shopping-cart',
    budget: 500, // Added budget field
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'Bills and utilities',
    color: 'var(--chart-2)',
    icon: 'zap',
    budget: 300, // Added budget field
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Movies, games, and fun activities',
    color: 'var(--chart-3)',
    icon: 'film',
    budget: 200, // Added budget field
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Public transport and fuel',
    color: 'var(--chart-4)',
    icon: 'car',
    budget: 400, // Added budget field
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous expenses',
    color: 'var(--chart-5)',
    icon: 'more-horizontal',
    budget: 100, // Added budget field
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Helper function to get category by ID
export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id)
}

// Helper function to get category color by ID
export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color || 'var(--chart-5)'
}
