import Link from 'next/link'
import { ArrowLeftRight, CreditCard, PieChart, Sparkles } from 'lucide-react'

const actions = [
  { href: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/insights', label: 'Insights', icon: PieChart },
  { href: '/ai', label: 'Assistant', icon: Sparkles },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-3 transition-colors hover:border-primary/40"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Icon className="size-[1.05rem]" />
          </span>
          <span className="text-[0.7rem] font-medium">{label}</span>
        </Link>
      ))}
    </div>
  )
}
