import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { formatRupiah } from '../utils/format'

function AnimatedBar({ value, delay, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ width: 0 }}
      animate={{ width: isInView ? `${value}%` : 0 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute inset-y-0 left-0 rounded-full ${className}`}
    />
  )
}

const SORT_OPTIONS = [
  { id: 'amount', label: 'Jumlah' },
  { id: 'budget', label: 'Budget %' },
  { id: 'count',  label: 'Transaksi' },
]

export default function CategoryGrid({ categories }) {
  const [sortBy, setSortBy] = useState('amount')

  const grandTotal = categories.reduce((s, c) => s + c.total, 0)

  const sorted = [...categories].sort((a, b) => {
    if (sortBy === 'amount') return b.total - a.total
    if (sortBy === 'count')  return b.count - a.count
    if (sortBy === 'budget') {
      const pctA = a.budget > 0 ? a.total / a.budget : 0
      const pctB = b.budget > 0 ? b.total / b.budget : 0
      return pctB - pctA
    }
    return 0
  })

  return (
    <div className="space-y-4">
      {/* Sort controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] uppercase tracking-[0.2em] text-finance-700/60 dark:text-finance-300/60 font-medium">
          Urutkan:
        </span>
        <div className="flex bg-white/40 dark:bg-white/5 rounded-full p-1 border border-black/[0.08] dark:border-white/10">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`relative px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                sortBy === opt.id
                  ? 'text-white'
                  : 'text-finance-700/70 dark:text-finance-300/70 hover:text-finance-900 dark:hover:text-finance-100'
              }`}
            >
              {sortBy === opt.id && (
                <motion.div
                  layoutId="category-sort-pill"
                  className="absolute inset-0 bg-gradient-to-r from-finance-600 to-finance-500 rounded-full"
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <span className="relative">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {sorted.map((cat, i) => {
          const pct       = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0
          const budgetPct = cat.budget > 0 ? Math.min((cat.total / cat.budget) * 100, 100) : null
          const isOver    = cat.budget > 0 && cat.total > cat.budget
          const remaining = cat.budget ? cat.budget - cat.total : null

          return (
            <motion.div
              key={cat.name}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="group relative glass-card rounded-2xl p-4 sm:p-5 overflow-hidden text-left"
            >
              {/* gradient backdrop */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />

              {/* Over budget alert glow */}
              {isOver && (
                <div className="absolute inset-0 rounded-2xl ring-1 ring-red-400/30 dark:ring-red-500/30 pointer-events-none" />
              )}

              {/* icon + over badge */}
              <div className="relative flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md`}>
                  <span>{cat.icon}</span>
                </div>
                {isOver && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.3 + i * 0.05 }}
                    className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 number-mono"
                  >
                    Over!
                  </motion.span>
                )}
              </div>

              {/* label */}
              <h4 className="text-sm font-semibold text-finance-950 dark:text-finance-50 mb-1 leading-tight">
                {cat.name}
              </h4>

              {/* actual vs budget */}
              <div className="flex items-center justify-between mb-2">
                <span className={`number-mono text-xs font-semibold ${
                  isOver ? 'text-red-600 dark:text-red-400' : 'text-finance-700 dark:text-finance-300'
                }`}>
                  {formatRupiah(cat.total, { compact: true })}
                </span>
                {cat.budget ? (
                  <span className="text-[10px] number-mono text-finance-700/50 dark:text-finance-300/50">
                    / {formatRupiah(cat.budget, { compact: true })}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 number-mono">
                    {cat.count} txn
                  </span>
                )}
              </div>

              {/* Budget bar or proportional bar */}
              {budgetPct !== null ? (
                <>
                  <div className={`relative h-1.5 rounded-full overflow-hidden mb-1.5 ${
                    isOver ? 'bg-red-100 dark:bg-red-900/30' : 'bg-finance-100/70 dark:bg-finance-900/50'
                  }`}>
                    <AnimatedBar
                      value={budgetPct}
                      delay={0.3 + i * 0.05}
                      className={
                        isOver
                          ? 'bg-gradient-to-r from-red-400 to-red-500'
                          : budgetPct > 80
                          ? 'bg-gradient-to-r from-peach-400 to-blush-500'
                          : `bg-gradient-to-r ${cat.color}`
                      }
                    />
                  </div>
                  <p className={`text-[9px] number-mono text-right ${
                    isOver
                      ? 'text-red-500 dark:text-red-400'
                      : budgetPct > 80
                      ? 'text-peach-600 dark:text-peach-400'
                      : 'text-finance-700/50 dark:text-finance-300/50'
                  }`}>
                    {isOver
                      ? `+${formatRupiah(cat.total - cat.budget, { compact: true })} over`
                      : `${formatRupiah(remaining, { compact: true })} left`}
                  </p>
                </>
              ) : (
                <>
                  <div className="relative h-1.5 rounded-full bg-finance-100/70 dark:bg-finance-900/50 overflow-hidden">
                    <AnimatedBar
                      value={pct}
                      delay={0.3 + i * 0.05}
                      className={`bg-gradient-to-r ${cat.color}`}
                    />
                  </div>
                  <p className="text-[9px] number-mono text-finance-700/50 dark:text-finance-300/50 mt-1.5 text-right">
                    {pct.toFixed(1)}% of total
                  </p>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
