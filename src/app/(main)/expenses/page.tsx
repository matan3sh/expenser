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

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const expensesData = await getAllExpenses(
    {
      userId,
      query: searchParams.query,
      category: searchParams.category,
      startDate: searchParams.startDate,
      endDate: searchParams.endDate,
      minAmount: searchParams.minAmount
        ? Number(searchParams.minAmount)
        : undefined,
      maxAmount: searchParams.maxAmount
        ? Number(searchParams.maxAmount)
        : undefined,
      sort: searchParams.sort,
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
