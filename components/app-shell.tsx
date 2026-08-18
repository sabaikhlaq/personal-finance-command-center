import { BottomNav } from '@/components/bottom-nav'
import { cn } from '@/lib/utils'

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="min-h-dvh bg-background">
      <div
        className={cn(
          'mx-auto w-full max-w-md px-4 pt-6 pb-36',
          className,
        )}
      >
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
