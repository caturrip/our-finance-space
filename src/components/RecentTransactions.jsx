import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatRupiah, formatDate } from '../utils/format'

const PAGE_SIZE = 10

const categoryEmoji = {
  'Makanan & Minuman': '🍜',
  'Transportasi':      '🚗',
  'Cicilan':           '💳',
  'Sedekah':           '🤲',
  'Entertaint':        '🎭',
  'Skin Care':         '✨',
  'Listrik/Air':       '💡',
  'Laundry':           '👕',
  'Lainnya':           '📦',
  'Kontrakan':         '🏠',
  'Orang Tua':         '👴',
  'Uang Harian':       '💰',
  'Salary':            '💼',
}

export default function RecentTransactions({ transactions }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filtered = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())
        && !t.category.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleFilter = (id) => { setFilter(id); setPage(0) }
  const handleSearch = (e) => { setSearch(e.target.value); setPage(0) }

  const filterTabs = [
    { id: 'all',     label: 'All' },
    { id: 'income',  label: 'Income' },
    { id: 'expense', label: 'Expense' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-5 sm:p-7"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-finance-700/70 dark:text-finance-300/70 mb-1 number-mono">
            Recent activity
          </p>
          <h3 className="display-serif text-2xl font-medium text-finance-950 dark:text-finance-50">
            Latest Transactions
          </h3>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-finance-700/50 dark:text-finance-300/50" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              className="bg-white/40 dark:bg-white/5 border border-black/[0.08] dark:border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs w-36 sm:w-44 focus:outline-none focus:ring-2 focus:ring-finance-400/40 placeholder:text-finance-700/40 dark:placeholder:text-finance-300/40 text-finance-950 dark:text-finance-50"
            />
          </div>

          <div className="flex bg-white/40 dark:bg-white/5 rounded-full p-1 border border-black/[0.08] dark:border-white/10">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleFilter(tab.id)}
                className={`relative px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filter === tab.id
                    ? 'text-white'
                    : 'text-finance-700/70 dark:text-finance-300/70 hover:text-finance-900 dark:hover:text-finance-100'
                }`}
              >
                {filter === tab.id && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-gradient-to-r from-finance-600 to-finance-500 rounded-full"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 number-mono">
              <th className="text-left font-medium pb-3 pr-3">Date</th>
              <th className="text-left font-medium pb-3 pr-3">Person</th>
              <th className="text-left font-medium pb-3 pr-3">Category</th>
              <th className="text-left font-medium pb-3 pr-3">Description</th>
              <th className="text-right font-medium pb-3 pr-3">Amount</th>
              <th className="text-right font-medium pb-3">Type</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={`${filter}-${search}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {paginated.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  className="border-t border-finance-100/60 dark:border-white/5 hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 pr-3 text-finance-700 dark:text-finance-200 number-mono text-xs">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        t.person === 'Catur'
                          ? 'bg-finance-100 text-finance-700 dark:bg-finance-500/20 dark:text-finance-300'
                          : 'bg-peach-100 text-peach-700 dark:bg-peach-500/20 dark:text-peach-300'
                      }`}>
                        {t.person[0]}
                      </div>
                      <span className="text-finance-950 dark:text-finance-50 text-sm">{t.person}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-finance-50 dark:bg-finance-500/10 text-xs font-medium text-finance-800 dark:text-finance-200 border border-finance-100/50 dark:border-finance-500/20">
                      <span>{categoryEmoji[t.category] || '📌'}</span>
                      <span>{t.category}</span>
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-finance-800 dark:text-finance-100">
                    {t.description}
                  </td>
                  <td className={`py-3 pr-3 text-right number-mono font-semibold ${
                    t.type === 'income'
                      ? 'text-finance-600 dark:text-finance-400'
                      : 'text-peach-700 dark:text-peach-400'
                  }`}>
                    {t.type === 'income' ? '+' : '−'} {formatRupiah(t.amount)}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                      t.type === 'income'
                        ? 'bg-finance-100 text-finance-700 dark:bg-finance-500/15 dark:text-finance-300'
                        : 'bg-peach-100 text-peach-700 dark:bg-peach-500/15 dark:text-peach-300'
                    }`}>
                      {t.type === 'income' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* Mobile cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`mobile-${filter}-${search}-${page}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden space-y-2.5"
        >
          {paginated.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/30 dark:bg-white/5 border border-black/[0.06] dark:border-white/5"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                t.type === 'income'
                  ? 'bg-finance-100 dark:bg-finance-500/15'
                  : 'bg-peach-100 dark:bg-peach-500/15'
              }`}>
                {categoryEmoji[t.category] || '📌'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-finance-950 dark:text-finance-50 truncate">
                    {t.description}
                  </p>
                  <p className={`text-sm font-semibold number-mono shrink-0 ${
                    t.type === 'income'
                      ? 'text-finance-600 dark:text-finance-400'
                      : 'text-peach-700 dark:text-peach-400'
                  }`}>
                    {t.type === 'income' ? '+' : '−'}{formatRupiah(t.amount, { compact: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-finance-700/70 dark:text-finance-300/70 mt-0.5">
                  <span>{t.person}</span>
                  <span>·</span>
                  <span>{t.category}</span>
                  <span>·</span>
                  <span className="number-mono">{formatDate(t.date)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="py-10 text-center text-sm text-finance-700/60 dark:text-finance-300/60">
          No transactions found
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-finance-100/60 dark:border-white/5">
          <p className="text-xs text-finance-700/55 dark:text-finance-300/55 number-mono">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}
            {' '}dari {filtered.length} transaksi
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed bg-finance-100/70 text-finance-700 hover:bg-finance-200/70 dark:bg-finance-500/15 dark:text-finance-300 dark:hover:bg-finance-500/25 transition-colors"
            >
              <ChevronLeft size={13} />
              Prev
            </button>

            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-6 h-6 rounded-md text-[11px] font-medium number-mono transition-colors ${
                    i === page
                      ? 'bg-finance-500 text-white'
                      : 'text-finance-700/60 dark:text-finance-300/60 hover:bg-finance-100/60 dark:hover:bg-finance-500/15'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed bg-finance-100/70 text-finance-700 hover:bg-finance-200/70 dark:bg-finance-500/15 dark:text-finance-300 dark:hover:bg-finance-500/25 transition-colors"
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
