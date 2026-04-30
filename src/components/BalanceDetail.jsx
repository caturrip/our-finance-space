import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { X, TrendingUp, TrendingDown } from 'lucide-react'
import { formatRupiah } from '../utils/format'
import { accountBreakdown, monthlyCashflow } from '../data/dummyData'

function AccountCard({ account, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="group relative glass-card rounded-2xl p-5 overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${account.color} opacity-[0.05] dark:opacity-[0.10] group-hover:opacity-[0.10] transition-opacity duration-300 pointer-events-none`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl">{account.emoji}</span>
          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${account.color}`} />
        </div>
        <p className="text-xs uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 font-medium mb-1">
          {account.name}
        </p>
        <p className="text-[10px] text-finance-600/50 dark:text-finance-400/50 mb-3">
          {account.label}
        </p>
        <p className="number-mono text-xl font-semibold text-finance-950 dark:text-finance-50">
          <span className="text-sm text-finance-600/60 dark:text-finance-400/60 mr-1">Rp</span>
          <CountUp end={account.balance} duration={1.8} separator="." enableScrollSpy scrollSpyOnce />
        </p>
      </div>
    </motion.div>
  )
}

function MonthFlowBar({ month, income, expense, maxVal, index }) {
  const incomeW = maxVal > 0 ? (income / maxVal) * 100 : 0
  const expenseW = maxVal > 0 ? (expense / maxVal) * 100 : 0
  const net = income - expense
  const isPositive = net >= 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.2 + index * 0.07 }}
      className="flex items-center gap-3"
    >
      <span className="text-[10px] uppercase tracking-wider text-finance-600/60 dark:text-finance-400/60 w-8 shrink-0">
        {month}
      </span>
      <div className="flex-1 space-y-1.5">
        <div className="relative h-2 rounded-full bg-finance-100/60 dark:bg-finance-900/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${incomeW}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-finance-400 to-finance-500 rounded-full"
          />
        </div>
        <div className="relative h-2 rounded-full bg-peach-100/60 dark:bg-peach-900/30 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expenseW}%` }}
            transition={{ duration: 1, delay: 0.35 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-peach-400 to-blush-400 rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isPositive
          ? <TrendingUp size={11} className="text-finance-500" />
          : <TrendingDown size={11} className="text-blush-500" />}
        <span className={`text-[10px] number-mono font-medium ${isPositive ? 'text-finance-600 dark:text-finance-400' : 'text-blush-600 dark:text-blush-400'}`}>
          {isPositive ? '+' : ''}{formatRupiah(net, { compact: true })}
        </span>
      </div>
    </motion.div>
  )
}

export default function BalanceDetail({ summary, onClose }) {
  const activeMonths = monthlyCashflow.filter(m => m.income > 0 || m.expense > 0)
  const maxVal = activeMonths.length > 0
    ? Math.max(...activeMonths.map(m => Math.max(m.income, m.expense)))
    : 1
  const ytdIncome = activeMonths.reduce((s, m) => s + m.income, 0)
  const ytdExpense = activeMonths.reduce((s, m) => s + m.expense, 0)
  const ytdNet = ytdIncome - ytdExpense
  const ytdPositive = ytdNet >= 0

  return (
    <motion.div
      id="balance-detail"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative glass-card rounded-3xl p-6 sm:p-8 mt-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-finance-700/60 dark:text-finance-300/60 font-medium mb-2">
              Balance Breakdown
            </p>
            <h3 className="display-serif text-2xl sm:text-3xl font-medium text-finance-950 dark:text-finance-50">
              Sebaran{' '}
              <span className="italic text-finance-600 dark:text-finance-400">Rekening</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-finance-600/60 dark:text-finance-400/60 hover:text-finance-900 dark:hover:text-finance-100 transition-colors"
            aria-label="Tutup detail"
          >
            <X size={16} />
          </button>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {accountBreakdown.map((acc, i) => (
            <AccountCard key={acc.name} account={acc} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-finance-200/30 dark:bg-finance-700/20 mb-8" />

        {/* Monthly Flow + YTD Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Flow Bars */}
          <div>
            <p className="text-xs uppercase tracking-widest text-finance-700/60 dark:text-finance-300/60 font-medium mb-5">
              Arus Kas 2026
            </p>
            <div className="space-y-3 mb-4">
              {activeMonths.map((m, i) => (
                <MonthFlowBar key={m.month} {...m} maxVal={maxVal} index={i} />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-gradient-to-r from-finance-400 to-finance-500" />
                <span className="text-[10px] text-finance-600/60 dark:text-finance-400/60">Pemasukan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-1.5 rounded-full bg-gradient-to-r from-peach-400 to-blush-400" />
                <span className="text-[10px] text-finance-600/60 dark:text-finance-400/60">Pengeluaran</span>
              </div>
            </div>
          </div>

          {/* YTD Summary */}
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-finance-700/60 dark:text-finance-300/60 font-medium">
              Ringkasan YTD
            </p>

            {/* Income */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card rounded-2xl p-4 flex items-center gap-4"
            >
              <span className="text-2xl">📈</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-finance-600/60 dark:text-finance-400/60 mb-1">
                  Total Pemasukan
                </p>
                <p className="number-mono text-lg font-semibold text-finance-950 dark:text-finance-50">
                  <span className="text-sm text-finance-600/50 dark:text-finance-400/50 mr-1">Rp</span>
                  <CountUp end={ytdIncome} duration={2} separator="." enableScrollSpy scrollSpyOnce />
                </p>
              </div>
            </motion.div>

            {/* Expense */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="glass-card rounded-2xl p-4 flex items-center gap-4"
            >
              <span className="text-2xl">📉</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-finance-600/60 dark:text-finance-400/60 mb-1">
                  Total Pengeluaran
                </p>
                <p className="number-mono text-lg font-semibold text-finance-950 dark:text-finance-50">
                  <span className="text-sm text-finance-600/50 dark:text-finance-400/50 mr-1">Rp</span>
                  <CountUp end={ytdExpense} duration={2} separator="." enableScrollSpy scrollSpyOnce />
                </p>
              </div>
            </motion.div>

            {/* Net YTD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.46 }}
              className={`rounded-2xl p-4 flex items-center gap-4 border ${
                ytdPositive
                  ? 'bg-finance-50/80 dark:bg-finance-500/10 border-finance-200/40 dark:border-finance-600/20'
                  : 'bg-blush-50/80 dark:bg-blush-500/10 border-blush-200/40 dark:border-blush-600/20'
              }`}
            >
              <span className="text-2xl">{ytdPositive ? '✅' : '⚠️'}</span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-finance-600/60 dark:text-finance-400/60 mb-1">
                  Net Cash Flow YTD
                </p>
                <p className={`number-mono text-lg font-semibold ${ytdPositive ? 'text-finance-700 dark:text-finance-300' : 'text-blush-700 dark:text-blush-300'}`}>
                  <span className="text-sm mr-1 opacity-60">Rp</span>
                  <CountUp end={Math.abs(ytdNet)} duration={2} separator="." enableScrollSpy scrollSpyOnce />
                  <span className="text-sm ml-1 opacity-60">
                    {ytdPositive ? 'surplus' : 'defisit'}
                  </span>
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}
