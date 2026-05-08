import { motion } from 'framer-motion'
import { formatRupiah } from '../utils/format'

const MONTH_NAMES_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

function generateInsights(summary, categories) {
  const insights = []
  const mo = new Date().getMonth()
  const { burnRate, daysIntoMonth, projectedExpense, monthlyIncome, monthlyExpense,
          deltaExpense, deltaIncome, netSavings } = summary

  // 1. Burn rate / spending pace
  if (burnRate > 0 && daysIntoMonth > 0) {
    const projNet = monthlyIncome - projectedExpense
    const isOver  = projectedExpense > monthlyIncome
    insights.push({
      id: 'burn-rate',
      type: burnRate > 90 ? 'danger' : burnRate > 70 ? 'warning' : 'good',
      icon: burnRate > 90 ? '🚨' : burnRate > 70 ? '🔥' : '✅',
      title: burnRate > 90 ? 'Pengeluaran Kritis!' : burnRate > 70 ? 'Waspadai Pengeluaran' : 'Pace Aman',
      body: `Hari ke-${daysIntoMonth}: sudah ${burnRate.toFixed(0)}% income terpakai. Proyeksi akhir bulan ${formatRupiah(projectedExpense, { compact: true })}.`,
      badge: isOver
        ? `Defisit ~${formatRupiah(Math.abs(projNet), { compact: true })}`
        : `Sisa ~${formatRupiah(projNet, { compact: true })}`,
      badgePositive: !isOver,
    })
  }

  // 2. Over budget alert
  const overBudgetCats = categories.filter(c => c.budget > 0 && c.total > c.budget)
  if (overBudgetCats.length > 0) {
    const worst = [...overBudgetCats].sort((a, b) => (b.total - b.budget) - (a.total - a.budget))[0]
    insights.push({
      id: 'over-budget',
      type: 'warning',
      icon: '⚠️',
      title: `${overBudgetCats.length} Kategori Over Budget`,
      body: `${worst.name} paling boros: +${formatRupiah(worst.total - worst.budget, { compact: true })} dari limit. ${overBudgetCats.map(c => c.icon).join(' ')}`,
      badge: `${overBudgetCats.length} kategori`,
      badgePositive: false,
    })
  } else if (categories.some(c => c.budget > 0)) {
    insights.push({
      id: 'budget-ok',
      type: 'good',
      icon: '🎯',
      title: 'Semua Budget Aman',
      body: 'Tidak ada kategori yang melampaui budget bulan ini. Pertahankan konsistensinya!',
      badge: 'Budget OK',
      badgePositive: true,
    })
  }

  // 3. vs bulan lalu
  if (deltaExpense !== null && mo > 0) {
    const prevMonthName = MONTH_NAMES_ID[mo - 1]
    const isGood = deltaExpense <= 0
    insights.push({
      id: 'vs-last-month',
      type: isGood ? 'good' : (deltaExpense > 30 ? 'warning' : 'neutral'),
      icon: isGood ? '📉' : '📈',
      title: isGood
        ? `${Math.abs(deltaExpense).toFixed(0)}% Lebih Hemat dari ${prevMonthName}`
        : `${deltaExpense.toFixed(0)}% Lebih Boros dari ${prevMonthName}`,
      body: isGood
        ? `Pengeluaran turun vs ${prevMonthName}. Tren bagus — teruskan!`
        : `Pengeluaran naik vs ${prevMonthName}. Perhatikan sisa bulan ini.`,
      badge: `${deltaExpense >= 0 ? '+' : ''}${deltaExpense.toFixed(0)}% vs ${prevMonthName}`,
      badgePositive: isGood,
    })
  }

  // 4. Top spending category
  if (categories.length > 0) {
    const top  = [...categories].sort((a, b) => b.total - a.total)[0]
    const pct  = monthlyExpense > 0 ? (top.total / monthlyExpense * 100) : 0
    const isHigh = pct > 60
    insights.push({
      id: 'top-category',
      type: isHigh ? 'caution' : 'neutral',
      icon: top.icon,
      title: `${top.name} Mendominasi`,
      body: `${pct.toFixed(0)}% dari total pengeluaran (${formatRupiah(top.total, { compact: true })}). ${isHigh ? 'Cukup tinggi — cek rinciannya.' : 'Proporsi masih wajar.'}`,
      badge: `${pct.toFixed(0)}% share`,
      badgePositive: !isHigh,
    })
  }

  // 5. Net savings status
  if (netSavings > 0) {
    insights.push({
      id: 'net-savings',
      type: 'good',
      icon: '💰',
      title: 'Ada Surplus Bulan Ini',
      body: `Surplus ${formatRupiah(netSavings, { compact: true })}. Alokasikan ke Dana Persalinan atau Dana Darurat — jangan tunggu akhir bulan!`,
      badge: `+${formatRupiah(netSavings, { compact: true })} net`,
      badgePositive: true,
    })
  } else if (netSavings < 0 && daysIntoMonth > 5) {
    insights.push({
      id: 'deficit',
      type: 'danger',
      icon: '🚨',
      title: 'Defisit Bulan Ini',
      body: `Pengeluaran ${formatRupiah(Math.abs(netSavings), { compact: true })} di atas income. Rem pengeluaran non-esensial sekarang!`,
      badge: `${formatRupiah(netSavings, { compact: true })} net`,
      badgePositive: false,
    })
  }

  // 6. Income delta
  if (deltaIncome !== null && Math.abs(deltaIncome) > 1) {
    const isUp = deltaIncome > 0
    insights.push({
      id: 'income-delta',
      type: isUp ? 'good' : 'neutral',
      icon: isUp ? '📈' : '📊',
      title: isUp ? `Income Naik ${deltaIncome.toFixed(0)}%` : `Income Turun ${Math.abs(deltaIncome).toFixed(0)}%`,
      body: `Pemasukan ${isUp ? 'meningkat' : 'menurun'} vs bulan lalu. Total income bulan ini: ${formatRupiah(monthlyIncome, { compact: true })}.`,
      badge: `${deltaIncome >= 0 ? '+' : ''}${deltaIncome.toFixed(0)}% income`,
      badgePositive: isUp,
    })
  }

  return insights
}

const typeStyle = {
  danger:  'from-red-50 to-rose-100/60 dark:from-red-950/40 dark:to-rose-900/20 border-red-200/60 dark:border-red-800/40',
  warning: 'from-orange-50 to-peach-100/60 dark:from-orange-950/40 dark:to-peach-900/20 border-peach-200/60 dark:border-peach-800/40',
  caution: 'from-amber-50 to-yellow-100/50 dark:from-amber-950/30 dark:to-yellow-900/20 border-yellow-200/60 dark:border-yellow-800/40',
  good:    'from-emerald-50 to-finance-100/50 dark:from-emerald-950/30 dark:to-finance-900/20 border-finance-200/60 dark:border-finance-800/30',
  neutral: 'from-finance-50/60 to-white/30 dark:from-finance-900/20 dark:to-finance-950/10 border-finance-100/60 dark:border-finance-700/20',
}
const dotColor = {
  danger: 'bg-red-500', warning: 'bg-peach-500', caution: 'bg-yellow-500',
  good: 'bg-finance-500', neutral: 'bg-finance-400',
}

function InsightCard({ insight, index }) {
  const style   = typeStyle[insight.type] || typeStyle.neutral
  const dot     = dotColor[insight.type]  || dotColor.neutral
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`shrink-0 w-72 sm:w-80 rounded-2xl border p-5 bg-gradient-to-br ${style} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${dot}`} />
          <span className="text-2xl leading-none">{insight.icon}</span>
        </div>
        {insight.badge && (
          <span className={`text-[10px] font-semibold number-mono px-2 py-0.5 rounded-full shrink-0 ${
            insight.badgePositive
              ? 'bg-finance-100 text-finance-700 dark:bg-finance-500/20 dark:text-finance-300'
              : 'bg-peach-100 text-peach-700 dark:bg-peach-500/20 dark:text-peach-300'
          }`}>
            {insight.badge}
          </span>
        )}
      </div>
      <h4 className="font-semibold text-sm text-finance-950 dark:text-finance-50 mb-1.5 leading-snug">
        {insight.title}
      </h4>
      <p className="text-xs text-finance-700/70 dark:text-finance-300/70 leading-relaxed">
        {insight.body}
      </p>
    </motion.div>
  )
}

export default function SmartInsights({ summary, categories }) {
  const insights = generateInsights(summary, categories)
  if (insights.length === 0) return null

  return (
    <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {insights.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
      </div>
    </div>
  )
}
