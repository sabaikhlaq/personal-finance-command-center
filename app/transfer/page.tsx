'use client'

import { useCallback, useState, useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { useFinance } from '@/components/finance-provider'
import { MoneyText } from '@/components/money-text'
import { MaskToggle } from '@/components/mask-toggle'
import { SectionHeader } from '@/components/section-header'
import { BottomNav } from '@/components/bottom-nav'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { CheckCircle } from 'lucide-react'
import { InstitutionMark } from '@/components/institution-mark'
import { getInstitution } from '@/lib/finance-data'

export default function TransferPage() {
  const { ready, state, masked, transfer, getAccount, totalBalance } = useFinance()
  const [fromId, setFromId] = useState<string | null>(null)
  const [toId, setToId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const fromAccount = fromId ? state.accounts.find((a) => a.id === fromId) : null
  const toAccount = toId ? state.accounts.find((a) => a.id === toId) : null
  const fromBalance = fromAccount?.balance ?? 0
  const toBalance = toAccount?.balance ?? 0

  const canTransfer =
    fromId &&
    toId &&
    fromId !== toId &&
    amount !== '' &&
    Number(amount) > 0 &&
    Number(amount) <= fromBalance

  const handleSetFrom = useCallback((id: string | null) => {
    setFromId(id)
    if (id && toId && id === toId) {
      setToId(null)
    }
  }, [toId])

  const handleSetTo = useCallback((id: string | null) => {
    setToId(id)
    if (id && fromId && id === fromId) {
      setFromId(null)
    }
  }, [fromId])

  const handleTransfer = useCallback(() => {
    if (!canTransfer) return
    setShowConfirmation(true)
  }, [canTransfer])

  const handleConfirm = useCallback(() => {
    setShowConfirmation(false)
    setShowSuccess(true)

    const amountNum = Number(amount)

    transfer({
      fromId: fromId!,
      toId: toId!,
      amount: amountNum,
      note: note || undefined,
    })
  }, [fromId, toId, amount, note, transfer])

  const handleCancel = useCallback(() => {
    setShowSuccess(false)
    setAmount('')
    setNote('')
  }, [])

  useEffect(() => {
    if (!showSuccess) return
    const timer = setTimeout(() => {
      setShowSuccess(false)
      setAmount('')
      setNote('')
    }, 3000)
    return () => clearTimeout(timer)
  }, [showSuccess])

  if (!ready) {
    return <AppShell><></></AppShell>
  }

  if (showSuccess) {
    const from = getAccount(fromId!)?.nickname ?? 'Unknown'
    const to = getAccount(toId!)?.nickname ?? 'Unknown'
    return (
      <AppShell className="min-h-dvh">
        <div className="flex min-h-dvh items-center justify-center p-6">
          <div className="bg-card border border-border p-8 rounded-2xl w-full max-w-md text-center">
            <CheckCircle className="size-12 mx-auto text-positive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Transfer successful</h2>
            <p className="text-muted-foreground mb-6">
              PKR{' '}{formatAmount(amount)} transferred from <strong>{from}</strong> to <strong>{to}</strong>.
            </p>
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:text-primary hover:bg-primary/20"
            >
              <Plus className="size-4" /> Start another transfer
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  const errorMessage = !fromId || !toId || fromId === toId
    ? 'Select different accounts'
    : !amount || Number(amount) <= 0
      ? 'Enter a valid amount'
      : Number(amount) > fromBalance
        ? 'Insufficient balance'
        : ''

  return (
    <AppShell>
      <PageHeader
        title="Transfer"
        subtitle="Move money between your accounts"
        action={<MaskToggle />}
      />

      <div className="mt-6 space-y-4">
        {/* From Account */}
        <SectionHeader title="From" />

        <div className="rounded-2xl border border-border bg-card p-4">
          {fromId ? (
            <div className="flex items-start gap-3">
              {fromAccount && (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full" style={{
                  backgroundColor: `color-mix(in oklch, ${getInstitution(fromAccount.institutionId).color} 16%, transparent)`,
                }}>
                  <InstitutionMark institutionId={fromAccount.institutionId} size="sm" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{fromAccount?.nickname ?? 'Select from account'}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {masked ? '••••' : formatBalance(fromBalance)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
              <Plus className="size-6 mb-2" />
              <span>Select from account</span>
            </div>
          )}
          <button
            onClick={() => {
              const ids = state.accounts.map((a) => a.id)
              setFromId(prev => {
                if (!prev) return ids[0]
                const currentIndex = ids.indexOf(prev)
                const nextIndex = currentIndex + 1 < ids.length ? currentIndex + 1 : 0
                return ids[nextIndex]
              })
            }}
            className="mt-3 w-full rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            Change
          </button>
        </div>

        {/* To Account */}
        <SectionHeader title="To" />

        <div className="rounded-2xl border border-border bg-card p-4">
          {toId ? (
            <div className="flex items-start gap-3">
              {toAccount && (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full" style={{
                  backgroundColor: `color-mix(in oklch, ${getInstitution(toAccount.institutionId).color} 16%, transparent)`,
                }}>
                  <InstitutionMark institutionId={toAccount.institutionId} size="sm" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{toAccount?.nickname ?? 'Select to account'}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {masked ? '••••' : formatBalance(toBalance)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-muted-foreground">
              <Plus className="size-6 mb-2" />
              <span>Select to account</span>
            </div>
          )}
          <button
            onClick={() => {
              const ids = state.accounts.map((a) => a.id)
              setToId(prev => {
                if (!prev) return ids[0]
                const currentIndex = ids.indexOf(prev)
                const nextIndex = currentIndex + 1 < ids.length ? currentIndex + 1 : 0
                return ids[nextIndex]
              })
            }}
            className="mt-3 w-full rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            Change
          </button>
        </div>

        {/* Swap button */}
        {fromId && toId && fromId !== toId && (
          <button
            onClick={() => {
              const temp = fromId
              setFromId(toId)
              setToId(temp)
            }}
            className="mt-2 flex w-full rounded-md border border-border px-3 py-2 text-sm font-medium text-primary hover:text-primary hover:bg-primary/10 transition-colors"
          >
            Swap accounts
          </button>
        )}

        {/* Amount */}
        <SectionHeader title="Amount" />

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="size-5" />{' '}
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="1"
              max={fromBalance.toString()}
              step="1"
              className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30"
              disabled={!fromId || !toId || fromId === toId}
              aria-label="Transfer amount"
            />
            <span className="text-muted-foreground text-xs">
              {fromBalance}
            </span>
          </div>
          {fromId && toId && fromId !== toId && !canTransfer && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}
        </div>

        {/* Note */}
        {fromId && toId && fromId !== toId && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              rows={2}
              className="w-full rounded-xl border-0 bg-transparent px-2 py-1 text-sm outline-none resize-none placeholder-muted-foreground"
              disabled={!canTransfer}
            />
          </div>
        )}

        {/* Transfer Summary */}
        {fromId && toId && fromId !== toId && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">From</p>
                <p className="font-medium truncate">{fromAccount?.nickname ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">To</p>
                <p className="font-medium truncate">{toAccount?.nickname ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Amount</p>
                <p className="font-medium">{formatAmount(amount)}</p>
              </div>
              {note && (
                <div>
                  <p className="text-muted-foreground mb-1">Note</p>
                  <p className="font-medium truncate">{note}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Total</p>
                <p className="font-medium text-positive">{formatAmount(amount)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action button */}
        <div className="mt-6">
          <button
            onClick={handleTransfer}
            disabled={!canTransfer || !!showConfirmation}
            className={cn(
              'w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors',
              !canTransfer && 'opacity-50 cursor-not-allowed',
              !!showConfirmation && 'opacity-50 cursor-not-allowed'
            )}
          >
            {showConfirmation ? 'Processing…' : 'Review Transfer'}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-zxl z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Review Transfer</h3>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">From</p>
                <p className="font-medium">{fromAccount?.nickname ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">To</p>
                <p className="font-medium">{toAccount?.nickname ?? '—'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Amount</p>
                <p className="font-medium">{formatAmount(amount)}</p>
              </div>
              {note && (
                <div>
                  <p className="text-muted-foreground mb-1">Note</p>
                  <p className="font-medium truncate">{note}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </AppShell>
  )
}

function formatAmount(amount: string | number): string {
  return new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(Math.abs(Number(amount)))
}

function formatBalance(balance: number): string {
  return new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(balance)
}