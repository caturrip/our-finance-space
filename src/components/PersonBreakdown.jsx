import { motion } from 'framer-motion'
import { formatRupiah } from '../utils/format'

const categoryEmoji = {
  'Makanan & Minuman': '🍜', 'Transportasi': '🚗', 'Cicilan': '💳',
  'Sedekah': '🤲', 'Entertaint': '🎭', 'Skin Care': '✨',
  'Listrik/Air': '💡', 'Laundry': '👕', 'Lainnya': '📦',
  'Kontrakan': '🏠', 'Orang Tua': '👴', 'Uang Harian': '💰',
}

function PersonCard({ name, emoji, data, grandTotal, accentColor, bgClass, index }) {
  const share   = grandTotal > 0 ? (data.total / grandTotal) * 100 : 0
  const topCats = Object.entries(data.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="glass-card rounded-2xl p-6 sm:p-7 flex-1 min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-13 h-13 w-[52px] h-[52px] rounded-2xl ${bgClass} flex items-center justify-center text-3xl shadow-md shrink-0`}>
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="display-serif text-xl font-medium text-finance-950 dark:text-finance-50">
            {name}
          </h3>
          <p className="text-xs text-finance-700/60 dark:text-finance-300/60">
            {share.toFixed(0)}% pengeluaran bersama
          </p>
        </div>
        <p className="number-mono text-xl font-semibold shrink-0" style={{ color: accentColor }}>
          {formatRupiah(data.total, { compact: true })}
        </p>
      </div>

      {/* Share bar */}
      <div className="h-1.5 rounded-full bg-finance-100 dark:bg-finance-900/40 overflow-hidden mb-5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${share}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.4 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: accentColor }}
        />
      </div>

      {/* Top categories */}
      <div className="space-y-3">
        {topCats.map(([catName, amount], ci) => {
          const pct = data.total > 0 ? (amount / data.total) * 100 : 0
          return (
            <motion.div
              key={catName}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 + ci * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-base w-6 text-center shrink-0">
                {categoryEmoji[catName] || '📌'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-finance-950 dark:text-finance-50 truncate pr-2">
                    {catName}
                  </span>
                  <span className="number-mono font-semibold text-finance-700 dark:text-finance-200 shrink-0">
                    {formatRupiah(amount, { compact: true })}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-finance-100 dark:bg-finance-900/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.7 + index * 0.1 + ci * 0.05 }}
                    className="h-full rounded-full opacity-75"
                    style={{ background: accentColor }}
                  />
                </div>
              </div>
              <span className="text-[10px] number-mono text-finance-700/50 dark:text-finance-300/50 w-8 text-right shrink-0">
                {pct.toFixed(0)}%
              </span>
            </motion.div>
          )
        })}
      </div>

      {topCats.length === 0 && (
        <p className="text-sm text-finance-700/50 dark:text-finance-300/50 text-center py-4">
          Belum ada transaksi
        </p>
      )}
    </motion.div>
  )
}

export default function PersonBreakdown({ transactions }) {
  const personMap = {}

  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const amount = t.amount || 0
      const entries = t.person === 'Keduanya'
        ? [['Catur', amount / 2], ['Vermita', amount / 2]]
        : [[t.person, amount]]

      for (const [p, share] of entries) {
        if (!personMap[p]) personMap[p] = { total: 0, categories: {} }
        personMap[p].total += share
        const cat = t.category || 'Lainnya'
        personMap[p].categories[cat] = (personMap[p].categories[cat] || 0) + share
      }
    })

  const grandTotal   = Object.values(personMap).reduce((s, p) => s + p.total, 0)
  if (grandTotal === 0) return null

  const caturData   = personMap['Catur']   || { total: 0, categories: {} }
  const vermitaData = personMap['Vermita'] || { total: 0, categories: {} }
  const caturShare  = grandTotal > 0 ? (caturData.total / grandTotal) * 100 : 50
  const vermitaShare = grandTotal > 0 ? (vermitaData.total / grandTotal) * 100 : 50

  return (
    <div className="space-y-5">
      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-5">
        <PersonCard
          name="Catur"
          emoji="👨🏻"
          data={caturData}
          grandTotal={grandTotal}
          accentColor="#10b981"
          bgClass="bg-finance-100 dark:bg-finance-500/20"
          index={0}
        />
        <PersonCard
          name="Vermita"
          emoji="👩🏻"
          data={vermitaData}
          grandTotal={grandTotal}
          accentColor="#f97316"
          bgClass="bg-peach-100 dark:bg-peach-500/20"
          index={1}
        />
      </div>

      {/* Combined comparison bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass-card rounded-2xl p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">👨🏻</span>
            <span className="text-xs font-medium text-finance-950 dark:text-finance-50">Catur</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-finance-700/50 dark:text-finance-300/50">
            Kontribusi Pengeluaran
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-finance-950 dark:text-finance-50">Vermita</span>
            <span className="text-base">👩🏻</span>
          </div>
        </div>

        {/* Split bar */}
        <div className="flex h-5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${caturShare}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-finance-500 h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${vermitaShare}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="bg-peach-500 h-full"
          />
        </div>

        <div className="flex items-center justify-between mt-2.5">
          <div>
            <span className="number-mono text-sm font-semibold text-finance-600 dark:text-finance-400">
              {caturShare.toFixed(0)}%
            </span>
            <span className="text-[10px] text-finance-700/50 dark:text-finance-300/50 number-mono ml-1.5">
              {formatRupiah(caturData.total, { compact: true })}
            </span>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-finance-700/50 dark:text-finance-300/50 number-mono">
              Total: {formatRupiah(grandTotal, { compact: true })}
            </p>
          </div>
          <div className="text-right">
            <span className="number-mono text-sm font-semibold text-peach-600 dark:text-peach-400">
              {vermitaShare.toFixed(0)}%
            </span>
            <span className="text-[10px] text-finance-700/50 dark:text-finance-300/50 number-mono ml-1.5">
              {formatRupiah(vermitaData.total, { compact: true })}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
