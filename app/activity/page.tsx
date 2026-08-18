'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { MaskToggle } from '@/components/mask-toggle'
import { FilterChips, type FilterOption } from '@/components/filter-chips'
import { TransactionRow } from '@/components/transaction-row'
import { ScreenLoader } from '@/components/screen-loader'
import { useFinance } from '@/components/finance-provider'
import { getInstitution } from '@/lib/finance-data'
import { formatDayGroup } from '@/lib/format'
import type { Transaction } from '@/lib/types'

const filters: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'food', label: 'Food' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bills', label: 'Bills' },
  { value: 'subscriptions', label: 'Subscriptions' },
]

function matches(t: Transaction, filter: string): boolean {
  if (filter === 'all') return true
  if (filter === 'income') return t.direction === 'in' && t.category !== 'transfer'
  if (filter === 'expense') return t.direction === 'out' && t.category !== 'transfer'
  return t.category === filter
}

export default function ActivityPage() {
  const { ready, state, masked, getAccount } = useFinance()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const filtered = state.transactions
      .filter((t) => matches(t, filter))
      .filter((t) =>
        query.trim()
          ? t.merchant.toLowerCase().includes(query.trim().toLowerCase()) ||
            (t.description ?? '').toLowerCase().includes(query.trim().toLowerCase())
          : true,
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const map = new Map<string, Transaction[]>()
    for (const t of filtered) {
      const key = formatDayGroup(t.date)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(t)
    }
    return [...map.entries()]
  }, [state.transactions, filter, query])

  return (
    <AppShell>
      <PageHeader
        title="Activity"
        subtitle="Every transaction across your accounts"
        action={<MaskToggle />}
      />

      {!ready ? (
        <ScreenLoader />
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
            />
          </div>

          <FilterChips options={filters} value={filter} onChange={setFilter} />

          {groups.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No transactions match your filters.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map(([day, txns]) => (
                <div key={day}>
                  <p className="mb-1 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {day}
                  </p>
                  <div className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
                    {txns.map((t) => {
                      const acc = getAccount(t.accountId)
                      return (
                        <TransactionRow
                          key={t.id}
                          transaction={t}
                          masked={masked}
                          accountLabel={acc ? getInstitution(acc.institutionId).name : undefined}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppShell>
  )
}
