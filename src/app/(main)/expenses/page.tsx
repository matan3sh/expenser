import { MobileExpensesView } from '@/components/expenses/MobileExpensesView'
import { getAllExpenses } from '@/lib/actions/expense.actions'
import { auth } from '@clerk/nextjs/server'

interface SearchParams {
  query?: string
  category?: string
  startDate?: string
  endDate?: string
  minAmount?: string
  maxAmount?: string
  sort?: string
  page?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function ExpensesPage({ searchParams }: PageProps) {
  const { userId } = await auth()
  // Await the searchParams
  const params = await searchParams

  if (!userId) {
    return null
  }

  const page = params.page ? parseInt(params.page) : 1
  const expensesData = await getAllExpenses(
    {
      userId,
      query: params.query,
      category: params.category,
      startDate: params.startDate,
      endDate: params.endDate,
      minAmount: params.minAmount ? Number(params.minAmount) : undefined,
      maxAmount: params.maxAmount ? Number(params.maxAmount) : undefined,
      sort: params.sort,
      page,
    },
    {} // You'll need to pass the exchange rates here
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="px-2 py-4">
          <MobileExpensesView initialExpenses={expensesData} />
        </div>
      </div>
    </div>
  )
}
