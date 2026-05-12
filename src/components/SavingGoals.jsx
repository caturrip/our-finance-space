import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import CountUp from 'react-countup'
import { formatRupiah } from '../utils/format'

function CombinedProgress({ goals }) {
  const totalSaved  = goals.reduce((s, g) => s + g.current, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)
  const pct = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl px-6 py-5 mb-5"
    >
      <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-finance-700/60 dark:text-finance-300/60 mb-0.5">
            Total Semua Goals
          </p>
          <div className="flex items-baseline gap-2">
            <p className="number-mono text-2xl font-bold text-finance-950 dark:text-finance-50">
              <span className="text-finance-700/60 dark:text-finance-300/60 text-sm mr-0.5">Rp</span>
              <CountUp end={totalSaved} duration={2} separator="." enableScrollSpy scrollSpyOnce />
            </p>
            <p className="text-xs text-finance-700/60 dark:text-finance-300/60 number-mono">
              / {formatRupiah(totalTarget, { compact: true })}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="number-mono text-3xl font-black text-finance-600 dark:text-finance-400">
            <CountUp end={pct} decimals={1} duration={2} enableScrollSpy scrollSpyOnce />
            <span className="text-base font-semibold opacity-70">%</span>
          </p>
          <p className="text-[10px] text-finance-700/55 dark:text-finance-300/55">
            overall progress
          </p>
        </div>
      </div>

      {/* Segmented bar — one segment per goal */}
      <div ref={ref} className="h-3 rounded-full bg-finance-100/70 dark:bg-finance-900/40 overflow-hidden flex gap-0.5">
        {goals.map((g, i) => {
          const segPct = totalTarget > 0 ? (g.current / totalTarget) * 100 : 0
          return (
            <motion.div
              key={g.id}
              initial={{ width: 0 }}
              animate={{ width: inView ? `${segPct}%` : 0 }}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-full bg-gradient-to-r ${g.color} relative overflow-hidden shrink-0`}
            >
              {segPct > 0 && (
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1 + i * 0.3 }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-2.5 flex-wrap">
        {goals.map(g => (
          <div key={g.id} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${g.color}`} />
            <span className="text-[10px] text-finance-700/60 dark:text-finance-300/60">{g.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function GoalCard({ goal, index }) {
  const progress = (goal.current / goal.target) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative glass-card rounded-2xl p-6 sm:p-7 overflow-hidden"
    >
      {/* Background gradient mood */}
      <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-[0.06] dark:opacity-[0.10] group-hover:opacity-[0.10] dark:group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-2xl shadow-lg`}>
              {goal.icon}
            </div>
            <div>
              <h3 className="display-serif text-xl font-medium text-finance-950 dark:text-finance-50">
                {goal.name}
              </h3>
              <p className="text-xs text-finance-700/60 dark:text-finance-300/60 mt-0.5">
                Target: <span className="number-mono">{goal.deadline}</span>
              </p>
            </div>
          </div>
          <motion.span
            animate={{ rotate: [0, 10, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
            className="text-2xl"
          >
            {goal.emoji}
          </motion.span>
        </div>

        {/* Progress amount */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 mb-1">
              Saved
            </p>
            <p className="number-mono text-2xl sm:text-3xl font-semibold text-finance-950 dark:text-finance-50">
              <span className="text-finance-700/60 dark:text-finance-300/60 text-base mr-1">Rp</span>
              <CountUp
                end={goal.current}
                duration={2.2}
                separator="."
                enableScrollSpy
                scrollSpyOnce
              />
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 mb-1">
              Goal
            </p>
            <p className="number-mono text-base font-medium text-finance-700/80 dark:text-finance-300/80">
              {formatRupiah(goal.target, { compact: true })}
            </p>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className={`relative h-3 rounded-full overflow-hidden mb-3 ${
          progress === 0
            ? 'bg-finance-100/70 dark:bg-finance-900/40 border border-dashed border-finance-300/40 dark:border-finance-600/30'
            : 'bg-finance-100/70 dark:bg-finance-900/40'
        }`}>
          {progress > 0 ? (
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${goal.color} rounded-full`}
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1 }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute inset-y-0 left-0 w-8 bg-gradient-to-r ${goal.color} rounded-full blur-sm`}
            />
          )}
        </div>

        {/* Progress percentage + remaining */}
        {progress > 0 ? (
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold number-mono text-finance-700 dark:text-finance-300">
              {progress.toFixed(1)}% complete
            </span>
            <span className="text-finance-700/60 dark:text-finance-300/60 number-mono">
              {formatRupiah(goal.target - goal.current, { compact: true })} to go
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-finance-700/50 dark:text-finance-300/50 italic">
              Belum mulai — yuk sisihkan!
            </span>
            <span className="text-finance-700/60 dark:text-finance-300/60 number-mono">
              {formatRupiah(goal.target, { compact: true })} target
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function SavingGoals({ goals }) {
  const allZero = goals.every(g => g.current === 0)

  return (
    <div className="space-y-6">
      <CombinedProgress goals={goals} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {goals.map((goal, i) => (
          <GoalCard key={goal.id} goal={goal} index={i} />
        ))}
      </div>

      {allZero && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.span
              animate={{ rotate: [0, 10, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl"
            >
              🌱
            </motion.span>
            <div>
              <p className="font-semibold text-finance-950 dark:text-finance-50 text-sm">
                Mulai dari yang kecil, konsisten itu kuncinya.
              </p>
              <p className="text-xs text-finance-700/60 dark:text-finance-300/60 mt-0.5">
                Target total tabungan:{' '}
                <span className="number-mono font-semibold">
                  {formatRupiah(goals.reduce((s, g) => s + g.target, 0), { compact: true })}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-finance-700/50 dark:text-finance-300/50 number-mono">
              Rp0 saved so far
            </span>
            <div className="w-2 h-2 rounded-full bg-peach-400 animate-pulse" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
