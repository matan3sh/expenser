import { CategoriesManager } from '@/components/categories/CategoriesManager'

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage your expense categories.</p>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-medium mb-4">Your Categories</h2>
          <CategoriesManager />
        </div>
      </div>
    </div>
  )
}
