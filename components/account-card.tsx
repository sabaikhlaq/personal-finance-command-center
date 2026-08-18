import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { InstitutionMark } from '@/components/institution-mark'
import { MoneyText } from '@/components/money-text'
import { getInstitution } from '@/lib/finance-data'
import { maskAccount } from '@/lib/format'
import type { Account } from '@/lib/types'

const typeLabel: Record<Account['type'], string> = {
  current: 'Current account',
  savings: 'Savings account',
  wallet: 'Mobile wallet',
  credit: 'Credit card',
}

export function AccountCard({
  account,
  masked = false,
}: {
  account: Account
  masked?: boolean
}) {
  const inst = getInstitution(account.institutionId)
  return (
    <Link
      href={`/accounts/${account.id}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
    >
      <InstitutionMark institutionId={account.institutionId} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{account.nickname}</p>
        <p className="truncate text-xs text-muted-foreground">
          {inst.name} · {maskAccount(account.last4, !masked)}
        </p>
      </div>
      <div className="text-right">
        <MoneyText amount={account.balance} masked={masked} className="text-sm font-semibold" />
        <p className="text-[0.65rem] text-muted-foreground">{typeLabel[account.type]}</p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
