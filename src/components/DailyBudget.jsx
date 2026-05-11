import { motion } from 'framer-motion'
import { formatRupiah } from '../utils/format'

const SIZE = 128
const R_OUTER = 56   // time-elapsed ring
const R_INNER = 42   // spend ring
const SW      = 10

function DualRing({ timePct, spendPct, spendColor }) {
  const c1 = 2 * Math.PI * R_OUTER
  const c2 = 2 * Math.PI * R_INNER
  const t  = Math.min(Math.max(timePct, 0), 100)
  const s  = Math.min(Math.max(spendPct, 0), 100)

  return (
    <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
      {/* Outer track */}
      <circle cx={SIZE/2} cy={SIZE/2} r={R_OUTER} fill="none" strokeWidth={SW}
        className="stroke-finance-100 dark:stroke-white/[0.08]" />
      {/* Outer fill: time elapsed (neutral) */}
      <motion.circle cx={SIZE/2} cy={SIZE/2} r={R_OUTER} fill="none" strokeWidth={SW}
        stroke="rgba(148,163,184,0.4)" strokeLinecap="round"
        strokeDasharray={c1}
        initial={{ strokeDashoffset: c1 }}
        animate={{ strokeDashoffset: c1 - (t / 100) * c1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Inner track */}
      <circle cx={SIZE/2} cy={SIZE/2} r={R_INNER} fill="none" strokeWidth={SW}
        className="stroke-finance-100 dark:stroke-white/[0.08]" />
      {/* Inner fill: budget consumed (colored) */}
      <motion.circle cx={SIZE/2} cy={SIZE/2} r={R_INNER} fill="none" strokeWidth={SW}
        stroke={spendColor} strokeLinecap="round"
        strokeDasharray={c2}
        initial={{ strokeDashoffset: c2 }}
        animate={{ strokeDashoffset: c2 - (s / 100) * c2 }}
        transition={{ duration: 1.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

export default function DailyBudget({ summary }) {
  const { monthlyIncome, monthlyExpense, daysIntoMonth, daysInMonth, activeMonth } = summary

  if (!monthlyIncome || !daysInMonth || daysIntoMonth === 0) return null

  const daysRemaining = Math.max(daysInMonth - daysIntoMonth, 0)
  const remaining     = monthlyIncome - monthlyExpense
  const safeDaily     = daysRemaining > 0 ? Math.round(remaining / daysRemaining) : 0
  const timePct       = (daysIntoMonth / daysInMonth) * 100
  const spendPct      = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0
  const isAhead       = spendPct <= timePct
  const paceGap       = Math.abs(timePct - spendPct).toFixed(0)

  const spendColor = safeDaily <= 0
    ? '#ef4444'
    : !isAhead && (spendPct - timePct) > 20
      ? '#ef4444'
      : !isAhead
        ? '#f97316'
        : '#10b981'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Dual ring */}
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <DualRing timePct={timePct} spendPct={spendPct} spendColor={spendColor} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-finance-700/50 dark:text-finance-300/50 number-mono">
              / hari
            </span>
            <span className="number-mono text-sm font-bold leading-none" style={{ color: spendColor }}>
              {safeDaily >= 0 ? formatRupiah(safeDaily, { compact: true }) : '−'}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 w-full min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-finance-700/60 dark:text-finance-300/60 number-mono mb-0.5">
            Jatah Harian
          </p>
          <p className="display-serif text-2xl sm:text-3xl font-medium text-finance-950 dark:text-finance-50 leading-tight">
            {safeDaily > 0
              ? formatRupiah(safeDaily)
              : safeDaily === 0 ? 'Pas-pasan' : 'Budget Habis'}
          </p>
          <p className="text-xs text-finance-700/55 dark:text-finance-300/55 mt-1 mb-4">
            {daysRemaining > 0
              ? `Untuk ${daysRemaining} hari tersisa bulan ${activeMonth}`
              : 'Hari terakhir bulan ini'}
          </p>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="glass-card rounded-xl p-2.5 sm:p-3 text-center">
              <p className="number-mono text-base sm:text-lg font-semibold text-finance-950 dark:text-finance-50">
                {daysRemaining}
              </p>
              <p className="text-[10px] text-finance-700/55 dark:text-finance-300/55 mt-0.5">hari lagi</p>
            </div>

            <div className="glass-card rounded-xl p-2.5 sm:p-3 text-center">
              <p className={`number-mono text-base sm:text-lg font-semibold ${
                remaining >= 0 ? 'text-finance-600 dark:text-finance-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {formatRupiah(Math.abs(remaining), { compact: true })}
              </p>
              <p className="text-[10px] text-finance-700/55 dark:text-finance-300/55 mt-0.5">
                {remaining >= 0 ? 'tersisa' : 'defisit'}
              </p>
            </div>

            <div className={`glass-card rounded-xl p-2.5 sm:p-3 text-center ${
              isAhead
                ? 'ring-1 ring-finance-400/30 dark:ring-finance-500/30'
                : 'ring-1 ring-peach-400/30 dark:ring-peach-500/30'
            }`}>
              <p className={`number-mono text-base sm:text-lg font-semibold ${
                isAhead ? 'text-finance-600 dark:text-finance-400' : 'text-peach-600 dark:text-peach-400'
              }`}>
                {paceGap}%
              </p>
              <p className="text-[10px] text-finance-700/55 dark:text-finance-300/55 mt-0.5">
                {isAhead ? 'lebih hemat' : 'melebihi pace'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Month progress bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px] number-mono text-finance-700/50 dark:text-finance-300/50 mb-1.5">
          <span>1 {activeMonth}</span>
          <span className="text-finance-950 dark:text-finance-50 font-medium">
            Hari ke-{daysIntoMonth} dari {daysInMonth}
          </span>
          <span>{daysInMonth} {activeMonth}</span>
        </div>

        {/* Track */}
        <div className="relative h-3 rounded-full bg-finance-100/70 dark:bg-finance-900/50 overflow-hidden">
          {/* Time bar (full height, neutral) */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(timePct, 100)}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 rounded-full bg-slate-200/80 dark:bg-slate-600/30"
          />
          {/* Spend bar (centered vertically, colored) */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(spendPct, 100)}%` }}
            transition={{ duration: 1.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 rounded-full"
            style={{
              top: '25%', height: '50%',
              background: spendColor,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] number-mono mt-1.5">
          <span className="flex items-center gap-1.5 text-finance-700/50 dark:text-finance-300/50">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-300/80 dark:bg-slate-600/50" />
            {timePct.toFixed(0)}% bulan berlalu
          </span>
          <span className="flex items-center gap-1.5" style={{ color: spendColor }}>
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: spendColor }} />
            {spendPct.toFixed(0)}% income terpakai
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-[10px] text-finance-700/40 dark:text-finance-300/40">
        <span>⬤ cincin luar = waktu berlalu</span>
        <span>⬤ cincin dalam = budget terpakai</span>
      </div>
    </motion.div>
  )
}
