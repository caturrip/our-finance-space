import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative mt-20 mb-8 px-4"
    >
      <div className="max-w-6xl mx-auto glass-card rounded-3xl px-6 sm:px-10 py-10 sm:py-12 text-center relative overflow-hidden">
        {/* Decorative blob */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-finance-300 via-peach-300 to-blush-300 rounded-full blur-3xl opacity-25 dark:opacity-20" />

        {/* Hearts floating */}
        <div className="relative">
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-finance-500 via-peach-400 to-blush-500 flex items-center justify-center shadow-xl shadow-peach-500/30"
            >
              <Heart size={24} className="text-white" fill="currentColor" />
            </motion.div>
          </div>

          <p className="display-serif italic text-2xl sm:text-3xl text-finance-950 dark:text-finance-50 mb-2 leading-tight">
            Built with <span className="text-blush-500">❤︎</span> for our family
            <br className="sm:hidden" />
            <span className="block sm:inline"> financial journey.</span>
          </p>

          <p className="text-sm text-finance-700/70 dark:text-finance-200/70 mb-6">
            Catur & Vermita · Powered by Railway WhatsApp Bot
          </p>

          {/* Tagline divider */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-finance-400" />
            <span className="display-serif italic text-sm text-finance-700/80 dark:text-finance-300/80">
              Managing money, building our future
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-peach-400" />
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] text-finance-700/50 dark:text-finance-300/50 number-mono">
            © {new Date().getFullYear()} Our Finance Space · Personal use only
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
