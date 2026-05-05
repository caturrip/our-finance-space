import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { Wallet, TrendingUp, TrendingDown, Receipt, Target, ChevronRight } from 'lucide-react'
import { formatRupiah } from '../utils/format'

const cards = (summary) => {
  const month = summary.activeMonth ?? 'Bulan Ini'
  const year = summary.activeYear ?? ''
  return [
  {
    title: 'Total Balance',
    value: summary.totalBalance,
    icon: Wallet,
    accent: 'from-finance-500 via-finance-600 to-finance-700',
    iconBg: 'from-finance-100 to-finance-200 dark:from-finance-500/20 dark:to-finance-600/20',
    iconColor: 'text-finance-700 dark:text-finance-300',
    isCurrency: true,
    emoji: '💰',
    sub: 'Semua rekening',
    hint: 'Lihat detail rekening',
    sectionId: 'balance-detail',
    isClickable: true,
  },
  {
    title: 'Income This Month',
    value: summary.monthlyIncome,
    icon: TrendingUp,
    accent: 'from-finance-400 to-finance-600',
    iconBg: 'from-finance-100 to-finance-200 dark:from-finance-500/15 dark:to-finance-600/15',
    iconColor: 'text-finance-700 dark:text-finance-300',
    isCurrency: true,
    emoji: '📈',
    sub: 'Gaji Catur + Gaji Vermita',
    sectionId: 'charts',
    isClickable: true,
    hint: 'Lihat cashflow chart',
  },
  {
    title: 'Expense This Month',
    value: summary.monthlyExpense,
    icon: TrendingDown,
    accent: 'from-peach-400 to-blush-500',
    iconBg: 'from-peach-100 to-blush-100 dark:from-peach-500/15 dark:to-blush-500/15',
    iconColor: 'text-peach-700 dark:text-peach-300',
    isCurrency: true,
    emoji: '📉',
    sub: `${month} ${year} (1–4 ${month})`,
    sectionId: 'categories',
    isClickable: true,
    hint: 'Lihat per kategori',
  },
  {
    title: 'Transactions',
    value: summary.transactionCount,
    icon: Receipt,
    accent: 'from-peach-300 to-peach-500',
    iconBg: 'from-peach-100 to-peach-200 dark:from-peach-500/15 dark:to-peach-600/15',
    iconColor: 'text-peach-700 dark:text-peach-300',
    isCurrency: false,
    emoji: '🧾',
    sub: 'Bulan ini',
    sectionId: 'transactions',
    isClickable: true,
    hint: 'Lihat semua transaksi',
  },
  {
    title: 'Saving Progress',
    value: summary.savingProgress * 100,
    icon: Target,
    accent: 'from-blush-400 to-peach-500',
    iconBg: 'from-blush-100 to-peach-100 dark:from-blush-500/15 dark:to-peach-500/15',
    iconColor: 'text-blush-700 dark:text-blush-300',
    isPercent: true,
    emoji: '🎯',
    sub: `${formatRupiah(summary.monthlySavingActual, { compact: true })} / ${formatRupiah(summary.monthlySavingTarget, { compact: true })}`,
    sectionId: 'goals',
    isClickable: true,
    hint: 'Lihat saving goals',
  },
]}

function SummaryCard({ card, index, onCardClick }) {
  const Icon = card.icon

  const handleClick = () => {
    if (!card.isClickable) return
    if (card.sectionId === 'balance-detail') {
      onCardClick?.()
      setTimeout(() => {
        document.getElementById('balance-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
    } else {
      document.getElementById(card.sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      role={card.isClickable ? 'button' : undefined}
      tabIndex={card.isClickable ? 0 : undefined}
      onKeyDown={card.isClickable ? (e) => e.key === 'Enter' && handleClick() : undefined}
      aria-label={card.isClickable ? card.hint : undefined}
      className={`group relative glass-card rounded-2xl p-5 sm:p-6 overflow-hidden ${
        card.isClickable ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-finance-400/50' : ''
      }`}
    >
      {/* Decorative gradient corner */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${card.accent} opacity-10 dark:opacity-20 blur-2xl group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500`} />

      {/* Clickable ring indicator */}
      {card.isClickable && (
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-finance-200/0 group-hover:ring-finance-300/30 dark:group-hover:ring-finance-500/20 transition-all duration-300 pointer-events-none" />
      )}

      {/* Icon row */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center backdrop-blur-sm`}>
          <Icon size={20} className={card.iconColor} strokeWidth={2} />
        </div>
        <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform">{card.emoji}</span>
      </div>

      {/* Title */}
      <p className="text-xs uppercase tracking-[0.15em] text-finance-700/70 dark:text-finance-300/70 font-medium mb-2">
        {card.title}
      </p>

      {/* Value */}
      <div className="number-mono text-2xl sm:text-3xl font-semibold text-finance-950 dark:text-finance-50 mb-2 leading-tight">
        {card.isCurrency ? (
          <>
            <span className="text-finance-700/60 dark:text-finance-300/60 text-lg mr-1">Rp</span>
            <CountUp end={card.value} duration={2} separator="." enableScrollSpy scrollSpyOnce />
          </>
        ) : card.isPercent ? (
          <>
            <CountUp end={card.value} duration={2} decimals={0} enableScrollSpy scrollSpyOnce />
            <span className="text-finance-700/60 dark:text-finance-300/60 text-lg ml-1">%</span>
          </>
        ) : (
          <CountUp end={card.value} duration={2} enableScrollSpy scrollSpyOnce />
        )}
      </div>

      {/* Subtitle + delta */}
      <div className="flex items-center justify-between gap-2 mb-0">
        <p className="text-xs text-finance-700/60 dark:text-finance-200/60">{card.sub}</p>
        {card.delta && (
          <span className={`text-xs font-semibold number-mono px-2 py-0.5 rounded-full ${
            card.deltaPositive
              ? 'bg-finance-100/80 text-finance-700 dark:bg-finance-500/15 dark:text-finance-300'
              : 'bg-blush-100/80 text-blush-700 dark:bg-blush-500/15 dark:text-blush-300'
          }`}>
            {card.delta}
          </span>
        )}
      </div>

      {/* Progress bar for saving card */}
      {card.isPercent && (
        <div className="mt-4 h-1 rounded-full bg-finance-100 dark:bg-finance-900/40 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${card.value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full bg-gradient-to-r ${card.accent} rounded-full`}
          />
        </div>
      )}

      {/* Clickable hint (shows on hover) */}
      {card.isClickable && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 py-2.5 px-5 flex items-center justify-between
            bg-gradient-to-t from-white/80 dark:from-finance-950/80 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <span className="text-[10px] uppercase tracking-wider text-finance-600/70 dark:text-finance-400/70 font-medium">
            {card.hint}
          </span>
          <ChevronRight size={11} className="text-finance-500/70 dark:text-finance-400/70" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default function SummaryCards({ summary, onBalanceClick }) {
  return (
    <div id="dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
      {cards(summary).map((card, i) => (
        <SummaryCard
          key={card.title}
          card={card}
          index={i}
          onCardClick={card.sectionId === 'balance-detail' ? onBalanceClick : undefined}
        />
      ))}
    </div>
  )
}
