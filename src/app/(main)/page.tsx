export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your expense tracking dashboard.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Total Expenses</h3>
          <p className="text-3xl font-bold mt-2">$1,234.56</p>
          <p className="text-sm text-muted-foreground mt-1">
            For current month
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Receipts Uploaded</h3>
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-sm text-muted-foreground mt-1">
            For current month
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Categories</h3>
          <p className="text-3xl font-bold mt-2">8</p>
          <p className="text-sm text-muted-foreground mt-1">
            Active categories
          </p>
        </div>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-4">Recent Expenses</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">Expense {i}</p>
                <p className="text-sm text-muted-foreground">
                  Category • {new Date().toLocaleDateString()}
                </p>
              </div>
              <p className="font-medium">${(Math.random() * 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
