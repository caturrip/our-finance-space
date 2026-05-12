import { motion } from 'framer-motion'

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-warm dark:bg-gradient-warm-dark transition-colors duration-700" />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-40 dark:opacity-30" />

      {/* Blob 1 — top left, finance green */}
      <motion.div
        className="blob bg-finance-300 dark:bg-finance-500"
        style={{ width: 520, height: 520, top: '-12%', left: '-10%' }}
        animate={{ x: [0, 70, -30, 0], y: [0, -50, 35, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 2 — top right, peach */}
      <motion.div
        className="blob bg-peach-300 dark:bg-peach-500"
        style={{ width: 580, height: 580, top: '15%', right: '-14%' }}
        animate={{ x: [0, -55, 35, 0], y: [0, 35, -55, 0], scale: [1, 0.9, 1.18, 1] }}
        transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 3 — bottom center, blush */}
      <motion.div
        className="blob bg-blush-300 dark:bg-blush-600"
        style={{ width: 440, height: 440, bottom: '-18%', left: '28%' }}
        animate={{ x: [0, 45, -45, 0], y: [0, -35, 25, 0], scale: [1, 1.06, 0.94, 1] }}
        transition={{ duration: 31, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 4 — bottom right, finance dark */}
      <motion.div
        className="blob bg-finance-400 dark:bg-finance-600 opacity-25 dark:opacity-30"
        style={{ width: 400, height: 400, bottom: '8%', right: '18%' }}
        animate={{ x: [0, -35, 22, 0], y: [0, 25, -35, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob 5 — mid left, extra warm tint */}
      <motion.div
        className="blob bg-peach-200 dark:bg-peach-700 opacity-30 dark:opacity-20"
        style={{ width: 320, height: 320, top: '45%', left: '-6%' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 30, 0], scale: [1, 1.1, 0.92, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
    </div>
  )
}
