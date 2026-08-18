'use client'

import { CalendarClock } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { MaskToggle } from '@/components/mask-toggle'
import { MoneyText } from '@/components/money-text'
import { InstitutionMark } from '@/components/institution-mark'
import { ScreenLoader } from '@/components/screen-loader'
import { useFinance } from '@/components/finance-provider'
import { formatDate } from '@/lib/format'

function daysUntil(iso: string): number {
  const d = new Date(iso)
  const now = new Date()
  return Math.max(0, Math.ceil((d.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
}

export default function SubscriptionsPage() {
  const { ready, state, masked, getAccount } = useFinance()

  const subs = [...state.subscriptions].sort(
    (a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime(),
  )
  const monthlyTotal = subs.reduce(
    (s, sub) => s + (sub.cycle === 'monthly' ? sub.amount : sub.amount / 12),
    0,
  )

  return (
    <AppShell>
      <PageHeader
        title="Subscriptions"
        subtitle="Recurring payments across your accounts"
        back
        action={<MaskToggle />}
      />

      {!ready ? (
        <ScreenLoader />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Estimated monthly cost</p>
            <MoneyText
              amount={monthlyTotal}
              masked={masked}
              className="mt-1 block text-3xl font-semibold"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {subs.length} active subscriptions
            </p>
          </div>

          <div className="space-y-3">
            {subs.map((sub) => {
              const acc = getAccount(sub.accountId)
              const days = daysUntil(sub.nextBilling)
              const soon = days <= 3
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground">
                    {sub.name.slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{sub.name}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      {acc && <InstitutionMark institutionId={acc.institutionId} size="sm" className="size-4 rounded-md text-[0.5rem]" />}
                      <span className="truncate">{acc?.nickname ?? 'Account'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <MoneyText
                      amount={sub.amount}
                      masked={masked}
                      className="text-sm font-semibold"
                    />
                    <p
                      className={`mt-0.5 flex items-center justify-end gap-1 text-[0.65rem] ${
                        soon ? 'text-negative' : 'text-muted-foreground'
                      }`}
                    >
                      <CalendarClock className="size-3" />
                      {days === 0 ? 'Due today' : `in ${days}d`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="px-1 text-xs text-muted-foreground text-pretty">
            Next billing dates are estimates based on your recent payment history. Amounts shown
            are the last charged value.
          </p>
        </div>
      )}
    </AppShell>
  )
}
