'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Wallet,
  Receipt,
  PieChart,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/accounts', label: 'Accounts', icon: Wallet },
  { href: '/activity', label: 'Activity', icon: Receipt },
  { href: '/insights', label: 'Insights', icon: PieChart },
  { href: '/ai', label: 'Assistant', icon: Sparkles },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      <Link
        href="/transfer"
        className="fixed bottom-[5.5rem] right-[max(1.25rem,calc(50%-13rem))] z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
        aria-label="New transfer"
      >
        <ArrowLeftRight className="size-5" />
      </Link>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
          {items.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className={cn('size-5', active && 'stroke-[2.25]')} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
