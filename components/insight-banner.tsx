'use client'

import Link from 'next/link'
import { Sparkles, ChevronRight } from 'lucide-react'
import { useFinance } from '@/components/finance-provider'
import { categoryMeta } from '@/lib/categories'
import { formatPKR } from '@/lib/format'

export function InsightBanner() {
  const { categoryTotals, monthSpend, state, masked } = useFinance()
  const top = categoryTotals[0]

  const subsTotal = state.subscriptions.reduce(
    (s, sub) => s + (sub.cycle === 'monthly' ? sub.amount : sub.amount / 12),
    0,
  )

  let message: string
  if (masked) {
    message = 'Your spending insights are hidden. Tap the eye icon to reveal them.'
  } else if (top && monthSpend > 0) {
    const share = Math.round((top.total / monthSpend) * 100)
    message = `${categoryMeta[top.category].label} is your biggest category this month at ${share}% of spending. Subscriptions cost about ${formatPKR(subsTotal, { compact: true })}/mo.`
  } else {
    message = 'Ask the assistant anything about your spending, balances or subscriptions.'
  }

  return (
    <Link
      href="/ai"
      className="flex items-start gap-3 rounded-2xl border border-primary/25 bg-accent/60 p-4 transition-colors hover:bg-accent"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-accent-foreground">Halqa Assistant</p>
        <p className="mt-0.5 text-sm text-pretty">{message}</p>
      </div>
      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
