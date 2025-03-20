'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryWithBudget } from '@/types/category'
import {
  ArrowRightLeft,
  DollarSign,
  MoreVertical,
  PencilIcon,
} from 'lucide-react'
import { useState } from 'react'
import { EditCategoryBudgetDialog } from './EditCategoryBudgetDialog'
import { EditCategoryDialog } from './EditCategoryDialog'
import { MoveExpensesDialog } from './MoveExpensesDialog'

interface CategoryMenuProps {
  category: CategoryWithBudget
  categories: CategoryWithBudget[]
  expenses: CategoryWithBudget['expenses']
}

export const CategoryMenu: React.FC<CategoryMenuProps> = ({
  category,
  categories,
  expenses,
}) => {
  const [editNameOpen, setEditNameOpen] = useState(false)
  const [editBudgetOpen, setEditBudgetOpen] = useState(false)
  const [moveExpensesOpen, setMoveExpensesOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditNameOpen(true)}>
            <PencilIcon className="mr-2 h-4 w-4" />
            <span>Edit name</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditBudgetOpen(true)}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Edit budget</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMoveExpensesOpen(true)}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            <span>Move expenses</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Name Dialog */}
      <EditCategoryDialog
        category={category}
        open={editNameOpen}
        onOpenChange={setEditNameOpen}
      />

      {/* Edit Budget Dialog */}
      <EditCategoryBudgetDialog
        category={category}
        open={editBudgetOpen}
        onOpenChange={setEditBudgetOpen}
      />

      {/* Move Expenses Dialog */}
      <MoveExpensesDialog
        category={category}
        categories={categories}
        expenses={expenses}
        open={moveExpensesOpen}
        onOpenChange={setMoveExpensesOpen}
      />
    </>
  )
}
