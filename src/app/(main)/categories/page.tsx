import { CategoriesManager } from '@/components/categories/CategoriesManager'

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <p className="text-muted-foreground">Manage your expense categories</p>
      </div>

      <div className="space-y-8">
        <CategoriesManager />
      </div>
    </div>
  )
}
