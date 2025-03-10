import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function AddExpensePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Expense</h1>
        <p className="text-muted-foreground">
          Manually add a new expense to your tracker.
        </p>
      </div>
      <Separator />
      <form className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              placeholder="Grocery shopping"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2">
              <option value="">Select a category</option>
              <option value="groceries">Groceries</option>
              <option value="dining">Dining</option>
              <option value="transportation">Transportation</option>
              <option value="utilities">Utilities</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            placeholder="Add any additional details about this expense"
            className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-24"
          ></textarea>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <input
            type="text"
            placeholder="Add tags separated by commas"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          />
          <p className="text-xs text-muted-foreground">
            Tags help you organize and filter your expenses
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Expense</Button>
        </div>
      </form>
    </div>
  )
}
