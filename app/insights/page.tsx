'use client'

import { useFinance } from '@/components/finance-provider'
import { formatPKR } from '@/lib/format'
import { categoryMeta } from '@/lib/categories'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { MoneyText } from '@/components/money-text'

export default function InsightsPage() {
  const {
    monthSpend,
    monthIncome,
    categoryTotals,
    state,
    masked,
  } = useFinance()

  const net = monthIncome - monthSpend

  // Overall financial insight message
  let overallMessage: string
  if (net > 0) {
    overallMessage = `You're keeping more money in your accounts this month. Your income of ${formatPKR(
      monthIncome,
    )} exceeds your spending of ${formatPKR(monthSpend)}.`
  } else if (net < 0) {
    overallMessage = `You're spending more than you're earning this month. Your spending of ${formatPKR(
      monthSpend,
    )} exceeds your income of ${formatPKR(monthIncome)}.`
  } else {
    overallMessage = `Your income and spending are balanced this month.`
  }

  // Spending overview text
  const spendText = `You've spent ${formatPKR(monthSpend)} this month`

  // Where money is going - top categories
  const topCategories = categoryTotals.slice(0, 4)

  // Something to watch - subscriptions or category pressure
  const monthlySubs = state.subscriptions
    .filter((s) => s.cycle === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  let watchMessage: string
  if (monthlySubs > 0) {
    watchMessage = `Your subscriptions will take ${formatPKR(
      monthlySubs,
    )} from your accounts this month.`
  } else if (net < 0) {
    watchMessage = `You're spending more than you're earning this month. Consider tracking your spending closely.`
  } else {
    watchMessage = `You're keeping more money than you're spending. Great job keeping your finances on track!`
  }

  // Opportunity / suggestion
  let opportunityMessage: string
  if (topCategories.length > 0) {
    const biggest = topCategories[0]
    const meta = categoryMeta[biggest.category]
    opportunityMessage = `You spent ${formatPKR(
      biggest.total,
    )} on ${meta.label} this month. Bringing that closer to your usual level could free up some room in your budget.`
  } else {
    opportunityMessage = `You're doing well keeping your spending in check this month.`
  }

  // Positive insight
  let positiveMessage: string
  if (net > 0) {
    positiveMessage = `You're saving ${formatPKR(net, { compact: true })} this month. Keep up the great work!`
  } else if (net === 0) {
    positiveMessage = `Your income and spending are balanced this month. That's a great foundation to build on!`
  } else {
    positiveMessage = `You're making it work this month — keeping track of your spending helps you stay in control.`
  }

  return (
    <AppShell>
      <PageHeader
        title="Insights"
        subtitle="Understand what your money is doing."
      />

      <div className="space-y-6">
        {/* Overall financial insight */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Financial overview</p>
          <p className="text-lg font-medium text-foreground">{overallMessage}</p>
        </div>

        {/* Spending overview */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Spending this month</p>
          <MoneyText amount={monthSpend} masked={masked} className="text-xl font-semibold" />
          <p className="mt-2 text-sm text-muted-foreground">{spendText}</p>
        </div>

        {/* Where your money is going */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Where your money is going</p>
          {topCategories.map(({ category, total }) => {
            const meta = categoryMeta[category]
            return (
              <div key={category} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs text-muted-foreground">
                  {meta.label}
                </span>
                <MoneyText amount={total} masked={masked} compact className="w-14 shrink-0 text-right text-xs font-medium" />
              </div>
            )
          })}

          {topCategories.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {categoryMeta[topCategories[0]?.category]?.label || 'Your biggest category'} is your biggest spending area this month.
            </p>
          )}
        </div>

        {/* Something to watch */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Something to watch</p>
          <p className="text-foreground">{watchMessage}</p>
        </div>

        {/* Opportunity / helpful suggestion */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Suggestion</p>
          <p className="text-foreground">{opportunityMessage}</p>
        </div>

        {/* Positive insight */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-2">Positive insight</p>
          <p className="text-foreground">{positiveMessage}</p>
        </div>
      </div>
    </AppShell>
  )
}