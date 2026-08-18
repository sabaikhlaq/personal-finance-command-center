import { cn } from '@/lib/utils'
import { getInstitution } from '@/lib/finance-data'

interface InstitutionMarkProps {
  institutionId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'size-8 text-[0.65rem]',
  md: 'size-10 text-xs',
  lg: 'size-12 text-sm',
}

export function InstitutionMark({
  institutionId,
  size = 'md',
  className,
}: InstitutionMarkProps) {
  const inst = getInstitution(institutionId)
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-xl font-semibold text-white',
        sizeMap[size],
        className,
      )}
      style={{ backgroundColor: inst.color }}
      aria-hidden="true"
    >
      {inst.short}
    </span>
  )
}
