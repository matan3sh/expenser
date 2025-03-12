import Spinner from '@/components/ui/spinner'

export const ProcessingIndicator = () => (
  <div className="flex flex-col items-center space-y-2">
    <Spinner className="h-8 w-8" />
    <p className="text-sm text-muted-foreground">Processing receipt...</p>
  </div>
)
