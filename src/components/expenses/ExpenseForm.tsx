'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NativeCalendar } from '@/components/ui/native-calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { categories } from '@/data/categories'
import { currencies as currencyOptions } from '@/data/currencies'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface Expense {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  categoryId: string
  location: string
}

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().min(1, 'Currency is required'),
  date: z.date({
    required_error: 'Date is required',
  }),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
})

type ExpenseFormData = z.infer<typeof formSchema>

interface ExpenseFormProps {
  initialData?: {
    amount?: number
    currency?: string
    date?: string
    description?: string
    location?: string
    category?: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export function ExpenseForm({
  initialData,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialData?.amount?.toString() || '',
      currency: initialData?.currency || 'USD',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      description: initialData?.description || '',
      location: initialData?.location || '',
      category: initialData?.category || '',
    },
  })

  async function onSubmit(values: ExpenseFormData) {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      date: values.date.toISOString(),
      description: values.description,
      amount: parseFloat(values.amount),
      currency: values.currency,
      categoryId: values.category,
      location: values.location,
    }

    console.log(newExpense)
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input
                      placeholder="0.00"
                      {...field}
                      type="number"
                      step="0.01"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencyOptions.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {`${currency.code} - ${currency.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <NativeCalendar
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null
                    field.onChange(date)
                  }}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  min="1900-01-01"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What did you spend on?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Where did you make this expense?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Expense</Button>
        </div>
      </form>
    </Form>
  )
}
