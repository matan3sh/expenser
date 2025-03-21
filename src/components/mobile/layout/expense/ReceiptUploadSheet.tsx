'use client'

import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { memo } from 'react'
import { UploadData } from '../hooks/useReceiptProcessor'

interface ReceiptUploadSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  uploadInitialData: UploadData | undefined
  uploadError: string | null
  onRetry: () => void
  onAddManually: () => void
}

export const ReceiptUploadSheet = memo(
  ({
    open,
    onOpenChange,
    uploadInitialData,
    uploadError,
    onRetry,
    onAddManually,
  }: ReceiptUploadSheetProps) => {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="w-full sm:w-[540px] overflow-y-auto p-0"
          side="right"
        >
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-2xl font-bold">
              {uploadError ? 'Processing Error' : 'Receipt Data'}
            </SheetTitle>
          </SheetHeader>
          <div className="p-6 pt-2">
            {uploadError ? (
              <div className="space-y-4">
                <div className="bg-destructive/10 text-destructive rounded-lg p-4">
                  {uploadError}
                </div>
                <p className="text-muted-foreground">
                  Please try again with a clearer image or enter your expense
                  details manually.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onRetry}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={onAddManually}
                  >
                    Add Manually
                  </Button>
                </div>
              </div>
            ) : (
              <ExpenseForm
                initialData={uploadInitialData}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    )
  }
)

ReceiptUploadSheet.displayName = 'ReceiptUploadSheet'
