import { motion } from 'framer-motion'
import { formatRupiah } from '../utils/format'

export default function CategoryGrid({ categories }) {
  const grandTotal = categories.reduce((s, c) => s + c.total, 0)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {categories.map((cat, i) => {
        const pct = grandTotal > 0 ? (cat.total / grandTotal) * 100 : 0
        return (
          <motion.button
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative glass-card rounded-2xl p-4 sm:p-5 overflow-hidden text-left"
          >
            {/* gradient backdrop */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />

            {/* icon */}
            <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-3 shadow-md`}>
              <span>{cat.icon}</span>
            </div>

            {/* label */}
            <h4 className="text-sm font-semibold text-finance-950 dark:text-finance-50 mb-1">
              {cat.name}
            </h4>

            {/* meta */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60 number-mono">
                {cat.count} txn
              </span>
              <span className="number-mono text-xs font-semibold text-finance-700 dark:text-finance-300">
                {formatRupiah(cat.total, { compact: true })}
              </span>
            </div>

            {/* proportional bar */}
            <div className="relative h-1.5 rounded-full bg-finance-100/70 dark:bg-finance-900/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${cat.color} rounded-full`}
              />
            </div>
            <p className="text-[9px] number-mono text-finance-700/50 dark:text-finance-300/50 mt-1.5 text-right">
              {pct.toFixed(1)}% of total
            </p>
          </motion.button>
        )
      })}
    </div>
  )
}
