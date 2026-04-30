import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, LayoutDashboard, Target, BarChart2, Receipt, Grid3X3 } from 'lucide-react'

const sections = [
  { id: 'dashboard',    label: 'Summary',   icon: LayoutDashboard },
  { id: 'goals',        label: 'Goals',     icon: Target },
  { id: 'charts',       label: 'Charts',    icon: BarChart2 },
  { id: 'transactions', label: 'Transaksi', icon: Receipt },
  { id: 'categories',   label: 'Kategori',  icon: Grid3X3 },
]

function NavDot({ id, label, icon: Icon, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex items-center justify-end"
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Go to ${label}`}
    >
      {/* Tooltip label */}
      <span className="absolute right-7 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 text-[10px] uppercase tracking-wider font-medium text-finance-700 dark:text-finance-300 whitespace-nowrap bg-white/90 dark:bg-finance-950/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-finance-200/40 dark:border-finance-700/30 pointer-events-none shadow-sm">
        {label}
      </span>
      {/* Dot */}
      <div className={`relative w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
        isActive
          ? 'bg-finance-500 border-finance-500 scale-125'
          : 'bg-transparent border-finance-300/60 dark:border-finance-500/50 group-hover:border-finance-400 group-hover:bg-finance-400/20'
      }`}>
        {isActive && (
          <motion.div
            layoutId="active-dot"
            className="absolute -inset-1.5 rounded-full bg-finance-400/20 dark:bg-finance-500/20"
          />
        )}
      </div>
    </motion.button>
  )
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers = []
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(obs => obs.disconnect())
  }, [])

  const scrollTo = (id) => {
    if (id === 'dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* Section Nav Dots — right side, desktop only */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
        {sections.map(({ id, label, icon }) => (
          <NavDot
            key={id}
            id={id}
            label={label}
            icon={icon}
            isActive={activeSection === id}
            onClick={() => scrollTo(id)}
          />
        ))}
      </div>

      {/* Mobile bottom nav — visible below lg */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 lg:hidden"
      >
        <div className="glass-strong rounded-2xl px-2 py-2 flex items-center gap-1">
          {sections.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-finance-700 dark:text-finance-200'
                    : 'text-finance-500/60 dark:text-finance-400/60 hover:text-finance-700 dark:hover:text-finance-200'
                }`}
                aria-label={label}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-finance-100/80 dark:bg-finance-500/15 rounded-xl"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10 text-[9px] font-medium whitespace-nowrap">{label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Back to Top button — desktop only to avoid overlap with mobile nav */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 hidden lg:flex w-11 h-11 rounded-2xl glass-strong border border-white/40 dark:border-white/10 items-center justify-center text-finance-600 dark:text-finance-300 hover:text-finance-900 dark:hover:text-finance-50 shadow-lg shadow-finance-900/10 hover:shadow-finance-500/20 hover:border-finance-300/60 dark:hover:border-finance-500/30 transition-all duration-300 group"
            aria-label="Kembali ke atas"
          >
            <ArrowUp size={17} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
