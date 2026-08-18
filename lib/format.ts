export function formatPKR(
  amount: number,
  opts: { compact?: boolean; sign?: boolean } = {},
): string {
  const { compact = false, sign = false } = opts
  const abs = Math.abs(amount)

  let body: string
  if (compact && abs >= 100000) {
    // Pakistani numbering: lakh / crore
    if (abs >= 10000000) {
      body = `${trim(abs / 10000000)} Cr`
    } else {
      body = `${trim(abs / 100000)} L`
    }
  } else {
    body = new Intl.NumberFormat('en-PK', {
      maximumFractionDigits: 0,
    }).format(abs)
  }

  const prefix = sign ? (amount < 0 ? '−' : '+') : amount < 0 ? '−' : ''
  return `${prefix}Rs ${body}`
}

function trim(n: number): string {
  return n.toFixed(n < 10 ? 2 : 1).replace(/\.0+$/, '')
}

export function maskAccount(last4: string, unmasked: boolean): string {
  return unmasked ? `•••• ${last4}` : '•••• ••••'
}

export function relativeDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const day = 24 * 60 * 60 * 1000
  const diffDays = Math.floor(diffMs / day)

  if (diffDays <= 0) {
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (date >= startToday) return 'Today'
    return 'Yesterday'
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDayGroup(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startYesterday = new Date(startToday.getTime() - 24 * 60 * 60 * 1000)
  if (date >= startToday) return 'Today'
  if (date >= startYesterday) return 'Yesterday'
  return date.toLocaleDateString('en-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}
