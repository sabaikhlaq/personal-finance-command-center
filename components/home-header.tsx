'use client'

import { MaskToggle } from '@/components/mask-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { useMounted } from '@/lib/use-mounted'

const USER_NAME = 'Zohaib'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Late night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function HomeHeader() {
  const mounted = useMounted()

  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground" suppressHydrationWarning>
          {mounted ? greeting() : 'Welcome'}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{USER_NAME}</h1>
      </div>
    </header>
  )
}