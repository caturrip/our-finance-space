// ============================================
// FORMATTERS
// ============================================

export function formatRupiah(amount, options = {}) {
  const { compact = false, showSymbol = true } = options

  if (compact) {
    if (amount >= 1_000_000_000) return `${showSymbol ? 'Rp' : ''}${(amount / 1_000_000_000).toFixed(1)}M`
    if (amount >= 1_000_000)     return `${showSymbol ? 'Rp' : ''}${(amount / 1_000_000).toFixed(1)}jt`
    if (amount >= 1_000)         return `${showSymbol ? 'Rp' : ''}${(amount / 1_000).toFixed(0)}rb`
    return `${showSymbol ? 'Rp' : ''}${amount}`
  }

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return showSymbol ? formatted : formatted.replace(/Rp\s?/, '')
}

export function formatDate(dateStr, opts = {}) {
  const { full = false, withDay = false } = opts
  const date = new Date(dateStr)
  if (full) {
    return date.toLocaleDateString('id-ID', {
      weekday: withDay ? 'long' : undefined,
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

export function getTodayString() {
  const today = new Date()
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Good morning'
  if (hour < 15) return 'Good afternoon'
  if (hour < 19) return 'Good evening'
  return 'Good night'
}
