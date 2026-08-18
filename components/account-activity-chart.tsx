'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { formatPKR } from '@/lib/format'
import type { Transaction } from '@/lib/types'

export function AccountActivityChart({
  transactions,
  masked,
}: {
  transactions: Transaction[]
  masked: boolean
}) {
  const days = 7
  const buckets: { label: string; out: number }[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const label = d.toLocaleDateString('en-PK', { weekday: 'short' }).slice(0, 1)
    const out = transactions
      .filter((t) => {
        const td = new Date(t.date)
        return (
          t.direction === 'out' &&
          t.category !== 'transfer' &&
          td.getDate() === d.getDate() &&
          td.getMonth() === d.getMonth()
        )
      })
      .reduce((s, t) => s + t.amount, 0)
    buckets.push({ label, out })
  }

  const hasData = buckets.some((b) => b.out > 0)

  return (
    <div className="h-28 w-full">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            />
            {!masked && (
              <Tooltip
                cursor={{ fill: 'var(--muted)' }}
                contentStyle={{
                  background: 'var(--popover)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  fontSize: 12,
                  color: 'var(--popover-foreground)',
                }}
                formatter={(v: number) => [formatPKR(v), 'Spent']}
              />
            )}
            <Bar dataKey="out" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          No spending in the last 7 days
        </div>
      )}
    </div>
  )
}
