'use client'

import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, PiggyBank, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useFinance } from '@/components/finance-provider'
import { categoryMeta } from '@/lib/categories'
import { formatPKR } from '@/lib/format'

interface Insight {
  icon: LucideIcon
  tone: 'positive' | 'negative' | 'neutral'
  title: string
  body: string
}

export function InsightCards() {
  const { monthSpend, monthIncome, categoryTotals, state } = useFinance()

  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = []
    const net = monthIncome - monthSpend

    if (net >= 0) {
      list.push({
        icon: PiggyBank,
        tone: 'positive',
        title: `You saved ${formatPKR(net, { compact: true })} this month`,
        body: `Income of ${formatPKR(monthIncome, { compact: true })} outpaced spending of ${formatPKR(monthSpend, { compact: true })}. Keep the momentum going.`,
      })
    } else {
      list.push({
        icon: ArrowDownRight,
        tone: 'negative',
        title: `Spending exceeded income by ${formatPKR(-net, { compact: true })}`,
        body: `You spent ${formatPKR(monthSpend, { compact: true })} against ${formatPKR(monthIncome, { compact: true })} of income this month.`,
      })
    }

    const top = categoryTotals[0]
    if (top) {
      const meta = categoryMeta[top.category]
      const share = Math.round((top.total / monthSpend) * 100)
      list.push({
        icon: TrendingUp,
        tone: 'neutral',
        title: `${meta.label} is your biggest category`,
        body: `${formatPKR(top.total, { compact: true })} — about ${share}% of everything you spent this month.`,
      })
    }

    const subsTotal = state.subscriptions
      .filter((s) => s.cycle === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0)
    if (subsTotal > 0) {
      list.push({
        icon: ArrowUpRight,
        tone: 'neutral',
        title: `${formatPKR(subsTotal, { compact: true })} in recurring subscriptions`,
        body: `Across ${state.subscriptions.length} active subscriptions billed to your linked accounts.`,
      })
    }

    return list
  }, [monthSpend, monthIncome, categoryTotals, state.subscriptions])

  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight, i) => {
        const Icon = insight.icon
        const toneColor =
          insight.tone === 'positive'
            ? 'var(--positive)'
            : insight.tone === 'negative'
              ? 'var(--negative)'
              : 'var(--primary)'
        return (
          <div key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `color-mix(in oklch, ${toneColor} 14%, transparent)` }}
            >
              <Icon className="size-4" style={{ color: toneColor }} />
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-balance text-foreground">{insight.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{insight.body}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
