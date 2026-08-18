export type InstitutionKind = 'bank' | 'wallet'

export type AccountType = 'current' | 'savings' | 'wallet' | 'credit'

export type TransactionCategory =
  | 'income'
  | 'transfer'
  | 'food'
  | 'shopping'
  | 'bills'
  | 'subscriptions'
  | 'transport'
  | 'health'
  | 'other'

export type TransactionDirection = 'in' | 'out'

export interface Institution {
  id: string
  name: string
  short: string
  kind: InstitutionKind
  /** accent color token expressed as an oklch value used for the institution mark */
  color: string
}

export interface Account {
  id: string
  institutionId: string
  nickname: string
  type: AccountType
  /** last 4 digits shown when unmasked */
  last4: string
  /** balance in PKR (minor unit not used; whole rupees) */
  balance: number
  /** available balance in PKR */
  available: number
  currency: 'PKR'
  updatedAt: string
}

export interface Card {
  id: string
  accountId: string
  network: 'Visa' | 'Mastercard' | 'UnionPay'
  last4: string
  type: 'debit' | 'credit'
  frozen: boolean
}

export interface Transaction {
  id: string
  accountId: string
  merchant: string
  description?: string
  amount: number
  direction: TransactionDirection
  category: TransactionCategory
  date: string
  /** for transfers, the counterpart account id */
  counterpartAccountId?: string
  pending?: boolean
}

export interface Subscription {
  id: string
  name: string
  accountId: string
  amount: number
  cycle: 'monthly' | 'yearly'
  nextBilling: string
  category: TransactionCategory
}

export interface FinanceState {
  accounts: Account[]
  cards: Card[]
  transactions: Transaction[]
  subscriptions: Subscription[]
}
