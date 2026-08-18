import { cn } from '@/lib/utils'
import { categoryMeta } from '@/lib/categories'
import { relativeDate } from '@/lib/format'
import { MoneyText } from '@/components/money-text'
import type { Transaction } from '@/lib/types'

interface TransactionRowProps {
  transaction: Transaction
  masked?: boolean
  showDate?: boolean
  accountLabel?: string
}

export function TransactionRow({
  transaction,
  masked = false,
  showDate = true,
  accountLabel,
}: TransactionRowProps) {
  const meta = categoryMeta[transaction.category]
  const Icon = meta.icon
  const isIn = transaction.direction === 'in'

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `color-mix(in oklch, ${meta.token} 16%, transparent)`,
          color: meta.token,
        }}
      >
        <Icon className="size-[1.1rem]" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{transaction.merchant}</p>
        <p className="truncate text-xs text-muted-foreground">
          {[
            showDate ? relativeDate(transaction.date) : null,
            accountLabel,
            transaction.pending ? 'Pending' : null,
          ]
            .filter(Boolean)
            .join(' · ') || meta.label}
        </p>
      </div>

      <MoneyText
        amount={isIn ? transaction.amount : -transaction.amount}
        masked={masked}
        sign
        className={cn(
          'text-sm font-semibold',
          isIn ? 'text-positive' : 'text-foreground',
        )}
      />
    </div>
  )
}
