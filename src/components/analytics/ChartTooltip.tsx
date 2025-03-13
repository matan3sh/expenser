import {
  NameType,
  Payload,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'

interface ChartTooltipProps {
  active?: boolean
  payload?: Payload<ValueType, NameType>[]
  label?: string
  formatValue: (value: number) => string
  valueLabel?: string
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatValue,
  valueLabel = 'Total',
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="font-medium mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">{valueLabel}</span>
          <span className="font-medium text-right">
            {formatValue(Number(p.value))}
          </span>
        </div>
      ))}
    </div>
  )
}
