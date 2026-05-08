import { motion } from 'framer-motion'
import { useState } from 'react'
import { formatRupiah } from '../utils/format'

const MONTH_FULL = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const DAY_LABELS  = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

export default function SpendingHeatmap({ transactions }) {
  const [hovered, setHovered] = useState(null)

  const now    = new Date()
  const yr     = now.getFullYear()
  const mo     = now.getMonth()
  const moStr  = `${yr}-${String(mo + 1).padStart(2, '0')}`
  const daysInMonth = new Date(yr, mo + 1, 0).getDate()
  const today  = now.getDate()

  // Aggregate expenses by day
  const dailyData = {}
  transactions
    .filter(t => t.type === 'expense' && t.date?.startsWith(moStr))
    .forEach(t => {
      const day = parseInt(t.date.slice(8, 10), 10)
      if (!dailyData[day]) dailyData[day] = { amount: 0, count: 0, topCat: {} }
      dailyData[day].amount += t.amount || 0
      dailyData[day].count++
      const cat = t.category || 'Lainnya'
      dailyData[day].topCat[cat] = (dailyData[day].topCat[cat] || 0) + (t.amount || 0)
    })

  const maxAmount = Math.max(...Object.values(dailyData).map(d => d.amount), 1)

  // Calendar grid starting on correct weekday
  const firstDow   = new Date(yr, mo, 1).getDay()
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - firstDow + 1
    return (day >= 1 && day <= daysInMonth) ? day : null
  })

  const hovData    = hovered ? dailyData[hovered] : null
  const hovTopCat  = hovData
    ? Object.entries(hovData.topCat).sort((a, b) => b[1] - a[1])[0]
    : null

  // Stats
  const activeDays    = Object.keys(dailyData).length
  const totalSpent    = Object.values(dailyData).reduce((s, d) => s + d.amount, 0)
  const avgDay        = activeDays > 0 ? totalSpent / activeDays : 0
  const maxDay        = Object.entries(dailyData).sort((a, b) => b[1].amount - a[1].amount)[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="glass-card rounded-2xl p-6 sm:p-7"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-finance-700/70 dark:text-finance-300/70 mb-1 number-mono">
            {MONTH_FULL[mo]} {yr}
          </p>
          <h3 className="display-serif text-2xl font-medium text-finance-950 dark:text-finance-50">
            Spending Calendar
          </h3>
        </div>

        {/* Hover tooltip / stats */}
        <div className="text-right min-w-[120px]">
          {hovered ? (
            <motion.div key={hovered} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 number-mono">
                {MONTH_FULL[mo].slice(0, 3)} {hovered}
              </p>
              {hovData ? (
                <>
                  <p className="number-mono text-lg font-semibold text-peach-700 dark:text-peach-300">
                    {formatRupiah(hovData.amount, { compact: true })}
                  </p>
                  <p className="text-[10px] text-finance-700/50 dark:text-finance-300/50">
                    {hovData.count} txn{hovTopCat ? ` · ${hovTopCat[0]}` : ''}
                  </p>
                </>
              ) : (
                <p className="text-sm text-finance-700/40 dark:text-finance-300/40">Tidak ada transaksi</p>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 number-mono mb-0.5">
                Hari termahal
              </p>
              {maxDay ? (
                <>
                  <p className="number-mono text-lg font-semibold text-peach-700 dark:text-peach-300">
                    Tgl {maxDay[0]}
                  </p>
                  <p className="text-[10px] text-finance-700/50 dark:text-finance-300/50 number-mono">
                    {formatRupiah(maxDay[1].amount, { compact: true })}
                  </p>
                </>
              ) : (
                <p className="text-sm text-finance-700/40 dark:text-finance-300/40">—</p>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[9px] uppercase tracking-wider text-finance-700/40 dark:text-finance-300/40 number-mono py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="aspect-square" />

          const data      = dailyData[day]
          const amount    = data?.amount || 0
          const isFuture  = day > today
          const isToday   = day === today
          const intensity = amount > 0 ? amount / maxAmount : 0

          // Opacity-based color: green tint for 0-spend, orange ramp for spending
          const bgAlpha   = intensity > 0 ? 0.15 + intensity * 0.72 : 0.06
          const bgColor   = intensity > 0
            ? `rgba(249,115,22,${bgAlpha})`
            : `rgba(16,185,129,0.07)`

          return (
            <motion.button
              key={day}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.008 }}
              whileHover={!isFuture ? { scale: 1.18 } : undefined}
              onMouseEnter={() => !isFuture && setHovered(day)}
              onMouseLeave={() => setHovered(null)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center select-none
                text-[10px] number-mono font-medium transition-shadow
                ${isFuture
                  ? 'text-finance-300/25 dark:text-finance-700/25 cursor-default'
                  : 'cursor-pointer hover:shadow-md'
                }
                ${isToday ? 'ring-2 ring-finance-500 ring-offset-1 dark:ring-offset-finance-950' : ''}
                ${hovered === day ? 'shadow-lg' : ''}
              `}
              style={!isFuture ? { background: bgColor } : undefined}
            >
              <span className={intensity > 0.55 ? 'text-orange-900 dark:text-orange-200' : ''}>
                {day}
              </span>
              {intensity > 0 && !isFuture && (
                <div
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: `rgba(249,115,22,${0.5 + intensity * 0.5})` }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Stats row + legend */}
      <div className="mt-5 pt-4 border-t border-finance-100/50 dark:border-white/5 grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="number-mono text-base font-semibold text-finance-950 dark:text-finance-50">
            {activeDays}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-finance-700/50 dark:text-finance-300/50 mt-0.5">
            Hari aktif
          </p>
        </div>
        <div className="text-center border-x border-finance-100/50 dark:border-white/5">
          <p className="number-mono text-base font-semibold text-peach-700 dark:text-peach-300">
            {formatRupiah(avgDay, { compact: true })}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-finance-700/50 dark:text-finance-300/50 mt-0.5">
            Rata-rata/hari
          </p>
        </div>
        <div className="text-center">
          <p className="number-mono text-base font-semibold text-finance-950 dark:text-finance-50">
            {daysInMonth - today}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-finance-700/50 dark:text-finance-300/50 mt-0.5">
            Hari tersisa
          </p>
        </div>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[9px] text-finance-700/40 dark:text-finance-300/40 number-mono">Hemat</span>
        {[0.08, 0.25, 0.45, 0.65, 0.87].map(v => (
          <div key={v} className="w-3.5 h-3.5 rounded-sm" style={{ background: `rgba(249,115,22,${v})` }} />
        ))}
        <span className="text-[9px] text-finance-700/40 dark:text-finance-300/40 number-mono">Boros</span>
      </div>
    </motion.div>
  )
}
