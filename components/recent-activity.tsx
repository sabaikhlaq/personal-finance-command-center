'use client'

import { useFinance } from '@/components/finance-provider'
import { SectionHeader } from '@/components/section-header'
import { TransactionRow } from '@/components/transaction-row'

export function RecentActivity({ limit = 5 }: { limit?: number }) {
  const { state, masked } = useFinance()

  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)

  return (
    <section>
      <SectionHeader title="Recent activity" href="/activity" />
      <div className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
        {recent.map((t) => (
          <TransactionRow key={t.id} transaction={t} masked={masked} />
        ))}
      </div>
    </section>
  )
}
