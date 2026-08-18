'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMounted } from '@/lib/use-mounted'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      suppressHydrationWarning
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
