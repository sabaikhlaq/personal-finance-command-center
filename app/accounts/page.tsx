
'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { MaskToggle } from '@/components/mask-toggle'
import { AccountCard } from '@/components/account-card'
import { MoneyText } from '@/components/money-text'
import { SectionHeader } from '@/components/section-header'
import { ScreenLoader } from '@/components/screen-loader'
import { useFinance } from '@/components/finance-provider'
import { getInstitution } from '@/lib/finance-data'

export default function AccountsPage() {
  const { ready, state, masked, totalBalance } = useFinance()

  const banks = state.accounts.filter(
    (a) => getInstitution(a.institutionId).kind === 'bank',
  )
  const wallets = state.accounts.filter(
    (a) => getInstitution(a.institutionId).kind === 'wallet',
  )

  return (
    <AppShell>
      <PageHeader
        title="Accounts"
        subtitle="All your banks and wallets in one place"
        action={<MaskToggle />}
      />

      {!ready ? (
        <ScreenLoader />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Combined balance</p>
            <MoneyText
              amount={totalBalance}
              masked={masked}
              className="mt-1 block text-3xl font-semibold"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Across {state.accounts.length} linked accounts
            </p>
          </div>

          <section>
            <SectionHeader title="Bank accounts" />
            <div className="space-y-3">
              {banks.map((a) => (
                <AccountCard key={a.id} account={a} masked={masked} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Mobile wallets" />
            <div className="space-y-3">
              {wallets.map((a) => (
                <AccountCard key={a.id} account={a} masked={masked} />
              ))}
            </div>
          </section>

          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="size-4" />
            Link a new account
          </Link>
        </div>
      )}
    </AppShell>
  )
}
