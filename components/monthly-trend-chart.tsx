'use client'

import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { useFinance } from '@/components/finance-provider'
import { formatPKR } from '@/lib/format'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function MonthlyTrendChart() {
  const { state } = useFinance()

  const data = useMemo(() => {
    const now = new Date()
    const buckets: { key: string; label: string; spend: number; income: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: MONTH_LABELS[d.getMonth()],
        spend: 0,
        income: 0,
      })
    }
    const index = new Map(buckets.map((b, i) => [b.key, i]))
    for (const t of state.transactions) {
      if (t.category === 'transfer') continue
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const idx = index.get(key)
      if (idx === undefined) continue
      if (t.direction === 'out') buckets[idx].spend += t.amount
      else buckets[idx].income += t.amount
    }
    return buckets
  }, [state.transactions])

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-4 text-sm font-medium text-muted-foreground">Spending trend</p>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                const spend = payload.find((p) => p.dataKey === 'spend')?.value as number
                return (
                  <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                    <p className="mb-1 font-medium text-popover-foreground">{label}</p>
                    <p className="tabular-nums text-muted-foreground">
                      Spent {formatPKR(spend ?? 0, { compact: true })}
                    </p>
                  </div>
                )
              }}
            />
            <Bar dataKey="spend" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
