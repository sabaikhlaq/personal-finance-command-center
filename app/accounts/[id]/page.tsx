'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowDownLeft, ArrowUpRight, CreditCard, Snowflake } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { MaskToggle } from '@/components/mask-toggle'
import { InstitutionMark } from '@/components/institution-mark'
import { MoneyText } from '@/components/money-text'
import { SectionHeader } from '@/components/section-header'
import { TransactionRow } from '@/components/transaction-row'
import { AccountActivityChart } from '@/components/account-activity-chart'
import { ScreenLoader } from '@/components/screen-loader'
import { useFinance } from '@/components/finance-provider'
import { getInstitution } from '@/lib/finance-data'
import { maskAccount, relativeDate } from '@/lib/format'

function isThisMonth(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>()
  const { ready, state, masked, getAccount } = useFinance()

  if (!ready) {
    return (
      <AppShell>
        <PageHeader title="Account" back />
        <ScreenLoader />
      </AppShell>
    )
  }

  const account = getAccount(params.id)

  if (!account) {
    return (
      <AppShell>
        <PageHeader title="Account not found" back />
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find this account. It may have been removed.
          </p>
          <Link
            href="/accounts"
            className="mt-4 inline-block text-sm font-medium text-primary"
          >
            Back to accounts
          </Link>
        </div>
      </AppShell>
    )
  }

  const inst = getInstitution(account.institutionId)
  const txns = state.transactions
    .filter((t) => t.accountId === account.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const cards = state.cards.filter((c) => c.accountId === account.id)

  const monthTx = txns.filter((t) => isThisMonth(t.date) && t.category !== 'transfer')
  const moneyIn = monthTx
    .filter((t) => t.direction === 'in')
    .reduce((s, t) => s + t.amount, 0)
  const moneyOut = monthTx
    .filter((t) => t.direction === 'out')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <AppShell>
      <PageHeader title={account.nickname} back action={<MaskToggle />} />

      <div className="space-y-6">
        <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
          <div className="flex items-center gap-3">
            <InstitutionMark
              institutionId={account.institutionId}
              size="md"
              className="ring-2 ring-primary-foreground/20"
            />
            <div>
              <p className="text-sm font-medium">{inst.name}</p>
              <p className="text-xs text-primary-foreground/70">
                {maskAccount(account.last4, !masked)}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-primary-foreground/70">Current balance</p>
          <MoneyText
            amount={account.balance}
            masked={masked}
            className="mt-1 block text-3xl font-semibold"
          />
          <div className="mt-4 flex items-center justify-between border-t border-primary-foreground/15 pt-3 text-sm">
            <span className="text-primary-foreground/70">
              Available <MoneyText amount={account.available} masked={masked} className="ml-1 font-medium" />
            </span>
            <span className="text-xs text-primary-foreground/60">
              Updated {relativeDate(account.updatedAt)}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowDownLeft className="size-3.5 text-positive" />
              Money in
            </span>
            <MoneyText
              amount={moneyIn}
              masked={masked}
              className="mt-1 block text-lg font-semibold text-positive"
            />
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowUpRight className="size-3.5" />
              Money out
            </span>
            <MoneyText
              amount={moneyOut}
              masked={masked}
              className="mt-1 block text-lg font-semibold"
            />
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 text-sm font-medium">Last 7 days</p>
          <AccountActivityChart transactions={txns} masked={masked} />
        </section>

        {cards.length > 0 && (
          <section>
            <SectionHeader title="Linked cards" />
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <CreditCard className="size-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {card.network} {maskAccount(card.last4, !masked)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{card.type} card</p>
                  </div>
                  {card.frozen && (
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[0.65rem] font-medium text-muted-foreground">
                      <Snowflake className="size-3" />
                      Frozen
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Transactions" />
          <div className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
            {txns.length > 0 ? (
              txns
                .slice(0, 12)
                .map((t) => <TransactionRow key={t.id} transaction={t} masked={masked} />)
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No transactions yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
