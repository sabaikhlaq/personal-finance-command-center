import { cn } from '@/lib/utils'
import { formatPKR } from '@/lib/format'

interface MoneyTextProps {
  amount: number
  masked?: boolean
  compact?: boolean
  sign?: boolean
  className?: string
}

export function MoneyText({
  amount,
  masked = false,
  compact = false,
  sign = false,
  className,
}: MoneyTextProps) {
  if (masked) {
    return (
      <span className={cn('font-mono tabular tracking-tight', className)} aria-label="Hidden amount">
        Rs •••••
      </span>
    )
  }
  return (
    <span className={cn('font-mono tabular tracking-tight', className)}>
      {formatPKR(amount, { compact, sign })}
    </span>
  )
}
