import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatRupiah } from '../utils/format'

export default function QuickKPIs({ transactions, summary }) {
  const kpis = useMemo(() => {
    const now  = new Date()
    const yr   = now.getFullYear()
    const mo   = String(now.getMonth() + 1).padStart(2, '0')
    const monthPrefix = `${yr}-${mo}`
    const today = now.toISOString().slice(0, 10)

    const monthExp = transactions.filter(
      t => t.type === 'expense' && t.date?.startsWith(monthPrefix)
    )

    const { daysIntoMonth = 1, monthlyExpense = 0, daysInMonth = 30 } = summary

    // Average daily spend
    const avgDaily = daysIntoMonth > 0 ? monthlyExpense / daysIntoMonth : 0

    // Biggest single expense
    const biggest = monthExp.length > 0
      ? monthExp.reduce((mx, t) => t.amount > mx.amount ? t : mx, monthExp[0])
      : null

    // No-spend days in current month so far
    const daysWithSpend = new Set(monthExp.map(t => t.date))
    let noSpendDays = 0
    for (let d = 1; d <= daysIntoMonth; d++) {
      const ds = `${yr}-${mo}-${String(d).padStart(2, '0')}`
      if (!daysWithSpend.has(ds)) noSpendDays++
    }

    // Today's total
    const todayTotal = monthExp
      .filter(t => t.date === today)
      .reduce((s, t) => s + t.amount, 0)

    // Top spender
    const byPerson = {}
    monthExp.forEach(t => {
      const p = t.person === 'Keduanya' ? 'Berdua' : (t.person || 'Unknown')
      byPerson[p] = (byPerson[p] || 0) + t.amount
    })
    const topSpender = Object.entries(byPerson).sort((a, b) => b[1] - a[1])[0]

    // Days left in month
    const daysLeft = Math.max(daysInMonth - daysIntoMonth, 0)

    return [
      {
        id: 'avg-daily',
        icon: '📊',
        label: 'Rata-rata Harian',
        value: formatRupiah(avgDaily, { compact: true }),
        sub: `dari ${daysIntoMonth} hari`,
        isGood: avgDaily < monthlyExpense / daysInMonth,
        accent: 'bg-gradient-to-br from-finance-50 to-finance-100/70 dark:from-finance-900/20 dark:to-finance-800/10 border-finance-200/40 dark:border-finance-700/20',
        valueColor: 'text-finance-700 dark:text-finance-300',
      },
      {
        id: 'biggest',
        icon: '💸',
        label: 'Terbesar',
        value: biggest ? formatRupiah(biggest.amount, { compact: true }) : '–',
        sub: biggest ? biggest.description.slice(0, 18) + (biggest.description.length > 18 ? '…' : '') : 'Belum ada',
        accent: 'bg-gradient-to-br from-peach-50 to-blush-50/70 dark:from-peach-900/20 dark:to-blush-900/10 border-peach-200/40 dark:border-peach-700/20',
        valueColor: 'text-peach-700 dark:text-peach-300',
      },
      {
        id: 'no-spend',
        icon: '🎯',
        label: 'Hari Hemat',
        value: `${noSpendDays} hari`,
        sub: `tanpa pengeluaran`,
        accent: noSpendDays > 3
          ? 'bg-gradient-to-br from-finance-50 to-finance-100/60 dark:from-finance-900/20 dark:to-finance-800/10 border-finance-200/40 dark:border-finance-700/20'
          : 'bg-gradient-to-br from-peach-50/60 to-blush-50/40 dark:from-peach-900/10 dark:to-blush-900/10 border-peach-200/30 dark:border-peach-700/15',
        valueColor: noSpendDays > 3 ? 'text-finance-600 dark:text-finance-400' : 'text-peach-600 dark:text-peach-400',
      },
      {
        id: 'today',
        icon: '🗓️',
        label: 'Hari Ini',
        value: todayTotal > 0 ? formatRupiah(todayTotal, { compact: true }) : 'Rp0',
        sub: todayTotal > 0 ? 'sudah keluar hari ini' : 'belum ada transaksi',
        accent: 'bg-gradient-to-br from-blush-50 to-peach-50/70 dark:from-blush-900/10 dark:to-peach-900/10 border-blush-200/40 dark:border-blush-700/20',
        valueColor: todayTotal > 0 ? 'text-peach-700 dark:text-peach-300' : 'text-finance-600 dark:text-finance-400',
      },
      {
        id: 'top-spender',
        icon: '👑',
        label: 'Top Spender',
        value: topSpender ? topSpender[0] : '–',
        sub: topSpender ? formatRupiah(topSpender[1], { compact: true }) : 'Belum ada',
        accent: 'bg-gradient-to-br from-finance-50 to-peach-50/60 dark:from-finance-900/10 dark:to-peach-900/10 border-finance-200/40 dark:border-finance-700/20',
        valueColor: 'text-finance-700 dark:text-finance-300',
      },
      {
        id: 'days-left',
        icon: '⏳',
        label: 'Hari Tersisa',
        value: `${daysLeft} hari`,
        sub: `menuju akhir bulan`,
        accent: daysLeft <= 5
          ? 'bg-gradient-to-br from-red-50 to-peach-50/60 dark:from-red-900/10 dark:to-peach-900/10 border-red-200/40 dark:border-red-700/20'
          : 'bg-gradient-to-br from-finance-50 to-finance-100/60 dark:from-finance-900/20 dark:to-finance-800/10 border-finance-200/40 dark:border-finance-700/20',
        valueColor: daysLeft <= 5 ? 'text-red-600 dark:text-red-400' : 'text-finance-700 dark:text-finance-300',
      },
    ]
  }, [transactions, summary])

  return (
    <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`shrink-0 w-[152px] sm:w-[168px] rounded-2xl border p-4 ${kpi.accent} backdrop-blur-sm cursor-default`}
          >
            <span className="text-2xl block mb-2 leading-none">{kpi.icon}</span>
            <p className={`number-mono text-lg font-bold leading-tight ${kpi.valueColor}`}>
              {kpi.value}
            </p>
            <p className="text-[11px] font-semibold text-finance-950 dark:text-finance-50 mt-0.5 leading-snug">
              {kpi.label}
            </p>
            <p className="text-[10px] text-finance-700/55 dark:text-finance-300/55 mt-0.5 truncate">
              {kpi.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Fade masks for horizontal scroll */}
      <div className="absolute left-0 top-0 bottom-2 w-4 pointer-events-none lg:hidden
        bg-gradient-to-r from-white/60 dark:from-[#0f172a]/60 to-transparent" />
      <div className="absolute right-0 top-0 bottom-2 w-8 pointer-events-none lg:hidden
        bg-gradient-to-l from-white/60 dark:from-[#0f172a]/60 to-transparent" />
    </div>
  )
}
