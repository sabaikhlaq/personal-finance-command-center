'use client'

import Link from 'next/link'
import { useFinance } from '@/components/finance-provider'
import { MoneyText } from '@/components/money-text'
import { categoryMeta } from '@/lib/categories'

export function SpendSummary() {
  const { monthSpend, categoryTotals, masked } = useFinance()
  const top = categoryTotals.slice(0, 4)
  const max = top[0]?.total ?? 1

  const monthName = new Date().toLocaleDateString('en-PK', { month: 'long' })

  return (
    <Link
      href="/insights"
      className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted-foreground">Spent in {monthName}</p>
        <MoneyText amount={monthSpend} masked={masked} className="text-xl font-semibold" />
      </div>

      <div className="mt-4 space-y-3">
        {top.map(({ category, total }) => {
          const meta = categoryMeta[category]
          return (
            <div key={category} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-xs text-muted-foreground">
                {meta.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(8, (total / max) * 100)}%`,
                    backgroundColor: meta.token,
                  }}
                />
              </div>
              <MoneyText
                amount={total}
                masked={masked}
                compact
                className="w-14 shrink-0 text-right text-xs font-medium"
              />
            </div>
          )
        })}
      </div>
    </Link>
  )
}
