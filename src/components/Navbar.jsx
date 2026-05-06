import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Sun, Moon, RefreshCw } from 'lucide-react'

const navLinks = [
  { label: 'Goals', href: '#goals' },
  { label: 'Charts', href: '#charts' },
  { label: 'Transaksi', href: '#transactions' },
  { label: 'Kategori', href: '#categories' },
]

function scrollToSection(href) {
  const id = href.replace('#', '')
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function useRelativeTime(date) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!date) return
    const update = () => {
      const sec = Math.floor((Date.now() - date.getTime()) / 1000)
      if (sec < 60) setLabel('baru saja')
      else if (sec < 3600) setLabel(`${Math.floor(sec / 60)}m lalu`)
      else setLabel(`${Math.floor(sec / 3600)}j lalu`)
    }
    update()
    const id = setInterval(update, 15_000)
    return () => clearInterval(id)
  }, [date])

  return label
}

export default function Navbar({ isDark, toggleDark, source, lastSync, onRefresh }) {
  const [spinning, setSpinning] = useState(false)
  const syncLabel = useRelativeTime(lastSync)

  const handleRefresh = async () => {
    if (spinning) return
    setSpinning(true)
    await onRefresh?.()
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl"
    >
      <div className="glass-strong rounded-2xl px-4 sm:px-6 py-3 grid grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr_auto] items-center gap-2">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group"
          aria-label="Back to top"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-finance-500 via-finance-600 to-peach-400 flex items-center justify-center shadow-lg shadow-finance-500/20 group-hover:shadow-finance-500/40 transition-shadow flex-none">
            <span className="text-white text-lg">💚</span>
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-finance-400 to-peach-400"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ filter: 'blur(8px)', zIndex: -1 }}
            />
          </div>
          <div className="hidden lg:block text-left">
            <p className="display-serif text-base font-semibold leading-tight text-finance-900 dark:text-finance-50">
              Our Finance Space
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-finance-700/70 dark:text-finance-300/70">
              Catur ❤︎ Vermita
            </p>
          </div>
        </button>

        {/* Nav links — center column */}
        <nav className="hidden md:flex items-justify gap-8">
          {navLinks.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => scrollToSection(href)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap text-finance-700/70 dark:text-finance-300/70 hover:text-finance-900 dark:hover:text-finance-50 hover:bg-finance-100/60 dark:hover:bg-finance-800/30 transition-all duration-200"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 justify-end">
          {/* Connection indicator + last sync + refresh */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/10">
            {source === 'live' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-finance-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-finance-500" />
                </span>
                <span className="text-xs font-medium text-finance-700 dark:text-finance-300">Live</span>
                {syncLabel && (
                  <span className="text-[10px] text-finance-600/60 dark:text-finance-400/60">
                    · {syncLabel}
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-peach-400" />
                <span className="text-xs font-medium text-peach-700 dark:text-peach-300">Demo Mode</span>
              </>
            )}

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              aria-label="Refresh data"
              className="ml-1 text-finance-600/60 dark:text-finance-400/60 hover:text-finance-700 dark:hover:text-finance-300 transition-colors"
            >
              <motion.div animate={{ rotate: spinning ? 360 : 0 }} transition={{ duration: 0.6 }}>
                <RefreshCw size={12} />
              </motion.div>
            </button>
          </div>

          {/* Dark mode toggle */}
          <motion.button
            onClick={toggleDark}
            className="relative w-11 h-11 rounded-xl glass-card flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            whileHover={{ rotate: 15 }}
            aria-label="Toggle dark mode"
          >
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
              className="text-finance-700 dark:text-peach-300"
            >
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
