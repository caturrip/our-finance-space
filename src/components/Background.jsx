import { motion } from 'framer-motion'

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-warm dark:bg-gradient-warm-dark transition-colors duration-700" />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-40 dark:opacity-30" />

      {/* Floating gradient blobs */}
      <motion.div
        className="blob bg-finance-300 dark:bg-finance-500"
        style={{ width: 480, height: 480, top: '-10%', left: '-8%' }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="blob bg-peach-300 dark:bg-peach-500"
        style={{ width: 560, height: 560, top: '20%', right: '-12%' }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 30, -50, 0],
          scale: [1, 0.9, 1.15, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="blob bg-blush-300 dark:bg-blush-600"
        style={{ width: 420, height: 420, bottom: '-15%', left: '30%' }}
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="blob bg-finance-400 dark:bg-finance-600 opacity-30"
        style={{ width: 380, height: 380, bottom: '10%', right: '20%' }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
