import {
  Banknote,
  Bus,
  CreditCard,
  HeartPulse,
  Receipt,
  Repeat,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import type { TransactionCategory } from './types'

interface CategoryMeta {
  label: string
  icon: LucideIcon
  /** chart token used for accents */
  token: string
}

export const categoryMeta: Record<TransactionCategory, CategoryMeta> = {
  income: { label: 'Income', icon: Banknote, token: 'var(--positive)' },
  transfer: { label: 'Transfers', icon: Repeat, token: 'var(--chart-5)' },
  food: { label: 'Food & Dining', icon: UtensilsCrossed, token: 'var(--chart-4)' },
  shopping: { label: 'Shopping', icon: ShoppingBag, token: 'var(--chart-3)' },
  bills: { label: 'Bills & Utilities', icon: Receipt, token: 'var(--chart-1)' },
  subscriptions: { label: 'Subscriptions', icon: CreditCard, token: 'var(--chart-2)' },
  transport: { label: 'Transport', icon: Bus, token: 'var(--chart-3)' },
  health: { label: 'Health', icon: HeartPulse, token: 'var(--negative)' },
  other: { label: 'Other', icon: Sparkles, token: 'var(--muted-foreground)' },
}
