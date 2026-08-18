'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  back?: boolean
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  back = false,
  action,
  className,
}: PageHeaderProps) {
  const router = useRouter()
  return (
    <header className={cn('mb-6 flex items-start gap-3', className)}>
      {back && (
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Go back"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
