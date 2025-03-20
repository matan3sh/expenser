'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CategoryWithBudget } from '@/types/category.types'
import { ArrowRightLeft, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteCategoryModal } from './DeleteCategoryModal'
import { EditCategoryModal } from './EditCategoryModal'
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
  const [editOpen, setEditOpen] = useState(false)
  const [moveExpensesOpen, setMoveExpensesOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMoveExpensesOpen(true)}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            <span>Move</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditCategoryModal
        category={category}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <MoveExpensesDialog
        category={category}
        categories={categories}
        expenses={expenses}
        open={moveExpensesOpen}
        onOpenChange={setMoveExpensesOpen}
      />

      <DeleteCategoryModal
        category={category}
        categories={categories}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}
