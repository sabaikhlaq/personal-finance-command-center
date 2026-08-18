'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getSeedState } from '@/lib/finance-data'
import type {
  Account,
  FinanceState,
  Transaction,
  TransactionCategory,
} from '@/lib/types'

const STORAGE_KEY = 'halqa.finance.v1'
const MASK_KEY = 'halqa.masked.v1'

interface TransferInput {
  fromId: string
  toId: string
  amount: number
  note?: string
}

interface FinanceContextValue {
  ready: boolean
  state: FinanceState
  masked: boolean
  toggleMasked: () => void
  transfer: (input: TransferInput) => Transaction
  reset: () => void
  // selectors
  totalBalance: number
  availableBalance: number
  getAccount: (id: string) => Account | undefined
  monthSpend: number
  monthIncome: number
  categoryTotals: { category: TransactionCategory; total: number }[]
}

const FinanceContext = createContext<FinanceContextValue | null>(null)

function isThisMonth(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FinanceState>(() => getSeedState())
  const [masked, setMasked] = useState(false)
  const [ready, setReady] = useState(false)

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as FinanceState
        if (parsed?.accounts?.length) setState(parsed)
      }
      const m = localStorage.getItem(MASK_KEY)
      if (m) setMasked(m === '1')
    } catch {
      // ignore corrupt storage
    }
    setReady(true)
  }, [])

  // persist
  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota errors
    }
  }, [state, ready])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(MASK_KEY, masked ? '1' : '0')
    } catch {
      // ignore
    }
  }, [masked, ready])

  const toggleMasked = useCallback(() => setMasked((m) => !m), [])

  const reset = useCallback(() => {
    setState(getSeedState())
  }, [])

  const transfer = useCallback((input: TransferInput): Transaction => {
    const now = new Date().toISOString()
    const id = `t_${Date.now()}`
    let created: Transaction | null = null

    setState((prev) => {
      const from = prev.accounts.find((a) => a.id === input.fromId)
      const to = prev.accounts.find((a) => a.id === input.toId)
      if (!from || !to) return prev

      const accounts = prev.accounts.map((a) => {
        if (a.id === from.id)
          return {
            ...a,
            balance: a.balance - input.amount,
            available: a.available - input.amount,
            updatedAt: now,
          }
        if (a.id === to.id)
          return {
            ...a,
            balance: a.balance + input.amount,
            available: a.available + input.amount,
            updatedAt: now,
          }
        return a
      })

      const outTx: Transaction = {
        id,
        accountId: from.id,
        merchant: to.nickname,
        description: input.note || 'Transfer',
        amount: input.amount,
        direction: 'out',
        category: 'transfer',
        date: now,
        counterpartAccountId: to.id,
      }
      const inTx: Transaction = {
        id: `${id}_in`,
        accountId: to.id,
        merchant: from.nickname,
        description: input.note || 'Transfer received',
        amount: input.amount,
        direction: 'in',
        category: 'transfer',
        date: now,
        counterpartAccountId: from.id,
      }
      created = outTx

      return {
        ...prev,
        accounts,
        transactions: [inTx, outTx, ...prev.transactions],
      }
    })

    return (
      created ?? {
        id,
        accountId: input.fromId,
        merchant: '',
        amount: input.amount,
        direction: 'out',
        category: 'transfer',
        date: now,
      }
    )
  }, [])

  const derived = useMemo(() => {
    const totalBalance = state.accounts.reduce((s, a) => s + a.balance, 0)
    const availableBalance = state.accounts.reduce((s, a) => s + a.available, 0)

    const monthTx = state.transactions.filter((t) => isThisMonth(t.date))
    const monthSpend = monthTx
      .filter((t) => t.direction === 'out' && t.category !== 'transfer')
      .reduce((s, t) => s + t.amount, 0)
    const monthIncome = monthTx
      .filter((t) => t.direction === 'in' && t.category !== 'transfer')
      .reduce((s, t) => s + t.amount, 0)

    const catMap = new Map<TransactionCategory, number>()
    for (const t of monthTx) {
      if (t.direction !== 'out' || t.category === 'transfer') continue
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount)
    }
    const categoryTotals = [...catMap.entries()]
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)

    return { totalBalance, availableBalance, monthSpend, monthIncome, categoryTotals }
  }, [state])

  const getAccount = useCallback(
    (id: string) => state.accounts.find((a) => a.id === id),
    [state.accounts],
  )

  const value: FinanceContextValue = {
    ready,
    state,
    masked,
    toggleMasked,
    transfer,
    reset,
    getAccount,
    ...derived,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}
