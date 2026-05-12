import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { formatRupiah } from '../utils/format'

const SIZE = 184
const R    = 78
const STROKE = 14
const CIRC = 2 * Math.PI * R

function scoreColor(score) {
  if (score >= 80) return { grad: ['#10b981', '#34d399'], text: '#059669', glow: 'rgba(16,185,129,0.3)' }
  if (score >= 60) return { grad: ['#f59e0b', '#fbbf24'], text: '#d97706', glow: 'rgba(245,158,11,0.3)' }
  if (score >= 40) return { grad: ['#f97316', '#fb923c'], text: '#ea580c', glow: 'rgba(249,115,22,0.3)' }
  return { grad: ['#ef4444', '#f87171'], text: '#dc2626', glow: 'rgba(239,68,68,0.3)' }
}

function scoreLabel(score) {
  if (score >= 85) return { label: 'Excellent! 🏆', tagline: 'Keuangan kalian sangat sehat!' }
  if (score >= 70) return { label: 'Sehat ✅',      tagline: 'Pengelolaan keuangan on track.' }
  if (score >= 55) return { label: 'Cukup Oke ⚡',  tagline: 'Ada ruang perbaikan bulan ini.' }
  if (score >= 40) return { label: 'Waspada ⚠️',    tagline: 'Perhatikan pengeluaran kalian.' }
  return { label: 'Kritis! 🚨', tagline: 'Segera kurangi pengeluaran.' }
}

function computeHealthScore(summary, categories) {
  const { burnRate = 0, netSavings = 0, monthlyIncome = 0 } = summary

  // Burn rate — 40 pts
  let burnScore = 0
  if (burnRate <= 70)       burnScore = 40
  else if (burnRate <= 90)  burnScore = Math.round(40 * (1 - (burnRate - 70) / 40))
  else                      burnScore = Math.max(0, Math.round(40 * (1 - (burnRate - 70) / 60)))

  // Budget adherence — 30 pts
  const catsWithBudget = categories.filter(c => c.budget > 0)
  let budgetScore = catsWithBudget.length === 0 ? 20 : 0
  if (catsWithBudget.length > 0) {
    const within = catsWithBudget.filter(c => c.total <= c.budget).length
    budgetScore = Math.round(30 * (within / catsWithBudget.length))
  }

  // Net savings — 30 pts
  let savingsScore = 0
  if (netSavings > 0 && monthlyIncome > 0) {
    const rate = netSavings / monthlyIncome
    savingsScore = Math.min(Math.round(30 * (rate / 0.20)), 30)
  }

  const score = Math.min(burnScore + budgetScore + savingsScore, 100)
  const overBudgetCount = categories.filter(c => c.budget > 0 && c.total > c.budget).length

  const breakdown = [
    {
      id: 'burn',
      label: 'Burn Rate',
      value: `${burnRate.toFixed(0)}% income`,
      score: burnScore,
      max: 40,
      status: burnRate <= 70 ? 'good' : burnRate <= 90 ? 'warn' : 'bad',
    },
    {
      id: 'budget',
      label: 'Budget Kontrol',
      value: overBudgetCount === 0 ? 'Semua aman' : `${overBudgetCount} over`,
      score: budgetScore,
      max: 30,
      status: overBudgetCount === 0 ? 'good' : overBudgetCount <= 2 ? 'warn' : 'bad',
    },
    {
      id: 'savings',
      label: 'Net Savings',
      value: netSavings > 0
        ? `+${formatRupiah(netSavings, { compact: true })}`
        : netSavings < 0
        ? `${formatRupiah(netSavings, { compact: true })}`
        : 'Break even',
      score: savingsScore,
      max: 30,
      status: savingsScore >= 20 ? 'good' : savingsScore >= 8 ? 'warn' : 'bad',
    },
  ]

  return { score, breakdown }
}

const dotColor = { good: 'bg-finance-500', warn: 'bg-yellow-500', bad: 'bg-red-500' }
const tagColor  = {
  good: 'bg-finance-100 text-finance-700 dark:bg-finance-500/15 dark:text-finance-300',
  warn: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
  bad:  'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
}

export default function FinancialHealthScore({ summary, categories }) {
  const { score, breakdown } = computeHealthScore(summary, categories)
  const colors = scoreColor(score)
  const { label, tagline } = scoreLabel(score)
  const offset = CIRC - (score / 100) * CIRC

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="glass-card gradient-border rounded-2xl p-6 sm:p-7 overflow-hidden relative"
    >
      {/* ambient glow */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none opacity-20 dark:opacity-30"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          transform: 'translate(-30%, -30%)',
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-center gap-7">

        {/* Ring gauge */}
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            <defs>
              <linearGradient id="health-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.grad[0]} />
                <stop offset="100%" stopColor={colors.grad[1]} />
              </linearGradient>
              <filter id="health-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Track */}
            <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" strokeWidth={STROKE}
              className="stroke-finance-100/80 dark:stroke-white/[0.07]" />
            {/* Filled arc */}
            <motion.circle
              cx={SIZE/2} cy={SIZE/2} r={R}
              fill="none" strokeWidth={STROKE}
              stroke="url(#health-grad)"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: CIRC }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              filter="url(#health-glow)"
            />
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <p className="number-mono text-[40px] font-black leading-none" style={{ color: colors.text }}>
              <CountUp end={score} duration={2} enableScrollSpy scrollSpyOnce />
            </p>
            <p className="text-[10px] uppercase tracking-wider text-finance-700/50 dark:text-finance-300/50 font-medium">
              Skor
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 w-full min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-finance-700/60 dark:text-finance-300/60 mb-0.5">
            Financial Health
          </p>
          <h3 className="display-serif text-2xl sm:text-3xl font-medium text-finance-950 dark:text-finance-50 mb-0.5">
            {label}
          </h3>
          <p className="text-xs text-finance-700/60 dark:text-finance-300/60 mb-5">
            {tagline}
          </p>

          <div className="space-y-3">
            {breakdown.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.4 + i * 0.09 }}
                className="flex items-center gap-3"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor[item.status]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-finance-950 dark:text-finance-50">
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-semibold number-mono px-2 py-0.5 rounded-full ${tagColor[item.status]}`}>
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-finance-100/80 dark:bg-finance-900/40 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.score / item.max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.3, delay: 0.5 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors.grad[0]}, ${colors.grad[1]})` }}
                    />
                  </div>
                </div>
                <span className="text-[11px] number-mono font-semibold text-finance-700/70 dark:text-finance-300/60 shrink-0 w-10 text-right">
                  {item.score}/{item.max}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
