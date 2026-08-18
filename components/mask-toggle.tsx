'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useFinance } from '@/components/finance-provider'
import { cn } from '@/lib/utils'

export function MaskToggle({ className }: { className?: string }) {
  const { masked, toggleMasked } = useFinance()
  return (
    <button
      type="button"
      onClick={toggleMasked}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
      aria-pressed={masked}
      aria-label={masked ? 'Show balances' : 'Hide balances'}
    >
      {masked ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )
}
