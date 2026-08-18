'use client'

import { TrendingUp } from 'lucide-react'
import { useFinance } from '@/components/finance-provider'
import { MoneyText } from '@/components/money-text'

export function BalanceHero() {
  const { totalBalance, availableBalance, masked, state, monthIncome, monthSpend } =
    useFinance()

  const net = monthIncome - monthSpend

  return (
    <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
      <p className="text-sm font-medium text-primary-foreground/70">Total balance</p>
      <div className="mt-1 flex items-end gap-2">
        <MoneyText
          amount={totalBalance}
          masked={masked}
          className="text-4xl font-semibold"
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-primary-foreground/15 pt-4 text-sm">
        <div>
          <p className="text-primary-foreground/60">Available</p>
          <MoneyText
            amount={availableBalance}
            masked={masked}
            className="mt-0.5 block font-medium"
          />
        </div>
        <div className="text-right">
          <p className="text-primary-foreground/60">This month</p>
          <span className="mt-0.5 flex items-center justify-end gap-1 font-medium">
            <TrendingUp className="size-3.5" />
            <MoneyText amount={net} masked={masked} sign compact />
          </span>
        </div>
        <div className="text-right">
          <p className="text-primary-foreground/60">Accounts</p>
          <p className="mt-0.5 font-medium">{state.accounts.length} linked</p>
        </div>
      </div>
    </section>
  )
}
