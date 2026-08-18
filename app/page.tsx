'use client'

import { AppShell } from '@/components/app-shell'
import { useFinance } from '@/components/finance-provider'
import { HomeHeader } from '@/components/home-header'
import { BalanceHero } from '@/components/balance-hero'
import { QuickActions } from '@/components/quick-actions'
import { SpendSummary } from '@/components/spend-summary'
import { InsightBanner } from '@/components/insight-banner'
import { RecentActivity } from '@/components/recent-activity'
import { AccountsPreview } from '@/components/accounts-preview'
import { ScreenLoader } from '@/components/screen-loader'

export default function HomePage() {
  const { ready } = useFinance()

  return (
    <AppShell>
      <HomeHeader />
      {!ready ? (
        <ScreenLoader />
      ) : (
        <div className="space-y-6">
          <BalanceHero />
          <QuickActions />
          <AccountsPreview />
          <SpendSummary />
          <InsightBanner />
          <RecentActivity />
        </div>
      )}
    </AppShell>
  )
}
