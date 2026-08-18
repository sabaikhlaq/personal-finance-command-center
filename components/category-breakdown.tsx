'use client'

import { useFinance } from '@/components/finance-provider'
import { categoryMeta } from '@/lib/categories'
import { formatPKR } from '@/lib/format'
import { MoneyText } from '@/components/money-text'

export function CategoryBreakdown() {
  const { categoryTotals, monthSpend } = useFinance()

  if (categoryTotals.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No spending recorded this month yet.
      </div>
    )
  }

  const max = categoryTotals[0]?.total ?? 1

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="text-sm font-medium text-muted-foreground">Spending by category</p>
        <MoneyText value={monthSpend} className="text-sm font-semibold" />
      </div>
      <ul className="flex flex-col gap-4">
        {categoryTotals.map(({ category, total }) => {
          const meta = categoryMeta[category]
          const Icon = meta.icon
          const pct = Math.round((total / monthSpend) * 100)
          const width = Math.max(6, Math.round((total / max) * 100))
          return (
            <li key={category} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span
                    className="flex size-6 items-center justify-center rounded-md"
                    style={{ backgroundColor: `color-mix(in oklch, ${meta.token} 16%, transparent)` }}
                  >
                    <Icon className="size-3.5" style={{ color: meta.token }} />
                  </span>
                  {meta.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatPKR(total, { compact: true })}
                  <span className="ml-1.5 text-xs">{pct}%</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${width}%`, backgroundColor: meta.token }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
