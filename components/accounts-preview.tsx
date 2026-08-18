'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useFinance } from '@/components/finance-provider'
import { InstitutionMark } from '@/components/institution-mark'
import { MoneyText } from '@/components/money-text'
import { SectionHeader } from '@/components/section-header'
import { getInstitution } from '@/lib/finance-data'

export function AccountsPreview() {
  const { state, masked } = useFinance()

  return (
    <section>
      <SectionHeader title="Accounts & wallets" href="/accounts" />
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {state.accounts.map((a) => {
          const inst = getInstitution(a.institutionId)
          return (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              className="flex w-40 shrink-0 snap-start flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <InstitutionMark institutionId={a.institutionId} size="sm" />
              <div>
                <p className="truncate text-xs text-muted-foreground">{inst.name}</p>
                <MoneyText
                  amount={a.balance}
                  masked={masked}
                  compact
                  className="mt-0.5 block text-base font-semibold"
                />
              </div>
            </Link>
          )
        })}
        <Link
          href="/onboarding"
          className="flex w-40 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Plus className="size-5" />
          <span className="text-xs font-medium">Add account</span>
        </Link>
      </div>
    </section>
  )
}
