import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  href?: string
  actionLabel?: string
}

export function SectionHeader({ title, href, actionLabel = 'See all' }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-xs font-medium text-primary transition-opacity hover:opacity-80"
        >
          {actionLabel}
          <ChevronRight className="size-3.5" />
        </Link>
      )}
    </div>
  )
}
