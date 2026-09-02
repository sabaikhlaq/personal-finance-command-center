'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { useFinance } from '@/components/finance-provider'
import { PageHeader } from '@/components/page-header'
import { MaskToggle } from '@/components/mask-toggle'
import { ScreenLoader } from '@/components/screen-loader'
import { formatPKR } from '@/lib/format'
import { categoryMeta } from '@/lib/categories'

export default function AssistantPage() {
  const {
    ready,
    state,
    masked,
    monthSpend,
    monthIncome,
    categoryTotals,
    getAccount,
  } = useFinance()

  const [messages, setMessages] = useState<
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([])

  const [input, setInput] = useState('')

  const addMessage = (
    role: 'user' | 'assistant',
    content: string,
  ) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content }])
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setInput('')

    addMessage('user', trimmed)

    try {
      const response = askAssistant(trimmed)
      addMessage('assistant', response)
    } catch {
      addMessage('assistant', "I'm having trouble processing that right now. Please try again.")
    }
  }

  const askAssistant = (question: string): string => {
    const lower = question.toLowerCase()
    let response = ''

    // Spending this month
    if (lower.includes('spend') || lower.includes('spent')) {
      if (lower.includes('this month')) {
        if (monthSpend === 0) {
          response = `You haven't spent anything this month! Your income of ${formatPKR(
            monthIncome,
          )} exceeds your spending.`
        } else {
          response = `You've spent ${formatPKR(monthSpend)} this month.`
          const net = monthIncome - monthSpend
          if (net !== 0) {
            const comparison = net > 0 ? 'more' : 'less'
            const diff = Math.abs(net)
            response += ` This is PKR ${formatAmount(
              diff,
            )} ${comparison} than your income.`
          }
          const topCat = categoryTotals.find((c) => c.total > 0)
          if (topCat) {
            const meta = categoryMeta[topCat.category]
            response += `\nYour biggest spending was ${meta?.label || topCat.category} — ${formatPKR(
              topCat.total,
            )}.`
          }
        }
      }
    }

    // Account balances
    if (
      lower.includes('account') ||
      lower.includes('balance') ||
      lower.includes('have')
    ) {
      if (lower.includes('across') || lower.includes('total')) {
        if (state.accounts.length === 0) {
          response = 'You don\'t have any linked accounts yet.'
        } else {
          const total = state.accounts.reduce((s, a) => s + a.balance, 0)
          if (state.accounts.length === 1) {
            const acc = state.accounts[0]
            response = `You have ${formatPKR(acc.balance)} in your ${acc.nickname} ${masked ? '•••• ••••' : `ending in ${acc.last4}`}.`
          } else {
            response = `You have ${formatPKR(total)} across ${state.accounts.length} accounts.\n\n`
            state.accounts.forEach((a) => {
              response += `- ${a.nickname}: ${formatPKR(a.balance)}${masked ? ' •••• ••••' : ` ending in ${a.last4}`}\n`
            })
          }
        }
      }
    }

    // Spending categories
    if (lower.includes('category') || lower.includes('go')) {
      if (categoryTotals.length > 0) {
        const top3 = categoryTotals.slice(0, 3)
        response = 'Your top spending categories this month:\n\n'
        top3.forEach((c) => {
          const meta = categoryMeta[c.category]
          response += `- ${meta?.label || c.category}: ${formatPKR(c.total)}\n`
        })
      } else {
        response = 'You haven\'t had any transactions this month yet.'
      }
    }

    // Subscriptions
    if (lower.includes('subscription') || lower.includes('coming up')) {
      const monthlySubs = state.subscriptions
        .filter((s) => s.cycle === 'monthly')
        .reduce((sum, s) => sum + s.amount, 0)

      if (monthlySubs === 0) {
        response = 'You have no active monthly subscriptions.'
      } else {
        response = `Your monthly subscriptions total ${formatPKR(monthlySubs)}.\n\nUpcoming payments:\n`
        const upcoming = state.subscriptions
          .filter((s) => new Date(s.nextBilling) > new Date())
          .sort((a, b) => new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime())
          .slice(0, 3)

        if (upcoming.length === 0) {
          response += 'No upcoming subscription payments.'
        } else {
          upcoming.forEach((s) => {
            const acc = getAccount(s.accountId ?? '')
            const days = Math.ceil(
              (new Date(s.nextBilling).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000),
            )
            const accInfo = acc ? ` (${acc.nickname})` : ''
            response += `- ${s.name}${accInfo}: ${formatPKR(s.amount)} ${days} days away\n`
          })
        }
      }
    }

    // Transfers
    if (lower.includes('transfer')) {
      const transfers = state.transactions.filter((t) => t.category === 'transfer')
      if (transfers.length === 0) {
        response = 'No transfers have been recorded yet.'
      } else {
        response = `You've had ${transfers.length} transfer(s).\n\n`
        transfers.slice(0, 3).forEach((t) => {
          const from = state.accounts.find((a) => a.id === t.accountId)
          const to = state.accounts.find((a) => a.id === (t.counterpartAccountId ?? ''))
          const fromName = from ? from.nickname : 'unknown'
          const toName = to ? to.nickname : 'unknown'
          response += `- ${formatPKR(Math.abs(t.amount))}: ${fromName} → ${toName}\n`
        })
      }
    }

    // Default fallback
    if (!response) {
      response = `I can help you understand your spending, accounts, subscriptions, and transfers. Try asking me one of those questions.`
    }

    return response
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!ready) {
    return (
      <AppShell>
        <div className="min-h-dvh flex items-center justify-center p-6">
          <div className="bg-card border border-border p-8 rounded-2xl w-full max-w-md text-center">
            <ScreenLoader />
            <p className="mt-4 text-lg text-muted-foreground">Loading your financial data...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <PageHeader
        title="Assistant"
        subtitle="Ask your financial questions"
        action={<MaskToggle />}
      />

      <div className="mt-6 space-y-4">
        {/* Conversation */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto p-3 rounded-xl border border-border bg-card">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Start by asking a question or selecting one below.
            </p>
          ) : messages.map((msg) => (
            <div key={msg.id} className="flex items-start">
              <div
                className={`rounded-2xl p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary/10 text-primary-foreground justify-end max-w-[80%]'
                    : 'bg-card text-foreground justify-start max-w-[80%]'}
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested questions - shown when no real conversation yet */}
        {messages.length < 2 && (
          <div className="border-t border-border pt-4">
            <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'How much did I spend this month?',
                'Where did most of my money go?',
                'How much do I have across my accounts?',
                'What payments are coming up?',
                'Why did I spend more this month?',
              ].map((q) => {
                const alreadyAsked = messages.some(
                  (m) => m.role === 'user' && m.content === q,
                )
                if (alreadyAsked) return null
                return (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: q }])
                      const trimmed = q.trim()
                      if (!trimmed) return
                      setInput('')
                      try {
                        const response = askAssistant(trimmed)
                        setMessages((prev) => [
                          ...prev,
                          { id: crypto.randomUUID(), role: 'assistant', content: response },
                        ])
                      } catch {
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            role: 'assistant',
                            content:
                              "I'm having trouble processing that right now. Please try again.",
                          },
                        ])
                      }
                    }}
                    className="w-full justify-center rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
                  >
                    {q}
                  </button>
                )
              }).filter((node) => node !== null)}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your money..."
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2 outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring/30 text-sm"
            aria-label="Financial question input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </AppShell>
  )
}