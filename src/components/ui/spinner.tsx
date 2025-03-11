import { cn } from '@/lib/utils'
import { Loader2, LucideProps } from 'lucide-react'

const Spinner = ({ className, ...props }: LucideProps) => {
  return (
    <Loader2 className={cn('h-4 w-4 animate-spin', className)} {...props} />
  )
}

export default Spinner
