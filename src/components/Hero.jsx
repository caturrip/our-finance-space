import { motion } from 'framer-motion'
import { ArrowDown, Heart, Sparkles } from 'lucide-react'
import { getTodayString, getGreeting, formatRupiah } from '../utils/format'

export default function Hero({ couple, summary }) {
  const today = getTodayString()
  const greeting = getGreeting()

  const scrollToDashboard = () => {
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })
  }

  const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
  }

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-20 overflow-hidden">
      {/* Decorative floating elements */}
      <motion.div
        className="absolute top-32 left-10 lg:left-20 text-finance-400/40 dark:text-finance-300/30"
        animate={{ y: [0, -20, 0], rotate: [0, 8, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={28} />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-8 lg:right-24 text-peach-400/50 dark:text-peach-300/40"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Heart size={24} fill="currentColor" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-1/4 text-blush-400/40 dark:text-blush-300/30"
        animate={{ y: [0, -15, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Sparkles size={20} />
      </motion.div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative max-w-5xl mx-auto text-center"
      >
        {/* Greeting badge */}
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-8">
          <div className="glass-card rounded-full px-5 py-2 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-finance-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-finance-500"></span>
            </span>
            <span className="text-sm font-medium text-finance-800 dark:text-finance-200">
              {greeting}, {couple.partner1.name} & {couple.partner2.name}
            </span>
          </div>
        </motion.div>

        {/* Tag — date */}
        <motion.p
          variants={fadeUp}
          className="text-xs sm:text-sm uppercase tracking-[0.3em] text-finance-700/70 dark:text-finance-300/70 mb-6 number-mono"
        >
          {today}
        </motion.p>

        {/* Massive headline */}
        <motion.h1
          variants={fadeUp}
          className="display-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight mb-6 text-finance-950 dark:text-finance-50"
        >
          Welcome to
          <br />
          <span className="italic font-normal text-gradient-finance">
            Our Finance Space
          </span>
        </motion.h1>

        {/* Couple names — romantic touch */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-8"
        >
          <span className="display-serif italic text-2xl sm:text-3xl text-finance-800 dark:text-finance-100">
            {couple.partner1.name}
          </span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl sm:text-3xl"
          >
            ❤️
          </motion.span>
          <span className="display-serif italic text-2xl sm:text-3xl text-peach-700 dark:text-peach-300">
            {couple.partner2.name}
          </span>
        </motion.div>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg md:text-xl text-finance-800/70 dark:text-finance-100/70 max-w-2xl mx-auto leading-relaxed mb-4"
        >
          Dashboard keuangan rumah tangga yang terhubung langsung dengan{' '}
          <span className="font-semibold text-finance-700 dark:text-finance-200">WhatsApp Finance Bot</span>.
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="display-serif italic text-lg sm:text-xl text-peach-700/80 dark:text-peach-300/80 mb-12"
        >
          Managing money, building our future.
        </motion.p>

        {/* CTA + Stats — stacked vertically */}
        <motion.div variants={fadeUp} className="flex flex-col items-center gap-6">
          {/* CTA Button */}
          <motion.button
            onClick={scrollToDashboard}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-finance-600 via-finance-500 to-peach-500 text-white font-medium shadow-lg shadow-finance-500/30 hover:shadow-xl hover:shadow-finance-500/40 transition-shadow"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-finance-600 via-finance-500 to-peach-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity -z-10" />
            <span>Scroll to Dashboard</span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={18} />
            </motion.div>
          </motion.button>

          {/* Quick Stats Strip */}
          {summary && (() => {
            const net = summary.monthlyIncome - summary.monthlyExpense
            const isPositive = net >= 0
            return (
              <div className="inline-flex items-center glass-card rounded-2xl px-6 py-3.5 gap-5 sm:gap-7">
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-finance-700/55 dark:text-finance-300/55 mb-0.5">
                    April Income
                  </p>
                  <p className="number-mono text-sm font-semibold text-finance-600 dark:text-finance-300">
                    {formatRupiah(summary.monthlyIncome, { compact: true })}
                  </p>
                </div>
                <div className="w-1 h-1 rounded-full bg-finance-300/60 dark:bg-finance-500/50" />
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-finance-700/55 dark:text-finance-300/55 mb-0.5">
                    April Expense
                  </p>
                  <p className="number-mono text-sm font-semibold text-peach-600 dark:text-peach-300">
                    {formatRupiah(summary.monthlyExpense, { compact: true })}
                  </p>
                </div>
                <div className="w-1 h-1 rounded-full bg-finance-300/60 dark:bg-finance-500/50" />
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-finance-700/55 dark:text-finance-300/55 mb-0.5">
                    Net
                  </p>
                  <p className={`number-mono text-sm font-semibold ${isPositive ? 'text-finance-600 dark:text-finance-400' : 'text-blush-600 dark:text-blush-400'}`}>
                    {isPositive ? '+' : ''}{formatRupiah(net, { compact: true })}
                  </p>
                </div>
              </div>
            )
          })()}
        </motion.div>

        {/* Decorative bottom indicator */}
        <motion.div
          variants={fadeUp}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-finance-400/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
