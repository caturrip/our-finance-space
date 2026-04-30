import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { formatRupiah } from '../utils/format'

function CustomTooltip({ active, payload, isDark }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className={`glass-strong rounded-xl px-3 py-2 border ${isDark ? 'border-white/10' : 'border-white/60'}`}>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color || entry.payload?.color }} />
          <span className="font-medium text-finance-950 dark:text-finance-50">
            {entry.name}:
          </span>
          <span className="number-mono text-finance-700 dark:text-finance-200 font-semibold">
            {formatRupiah(entry.value, { compact: true })}
          </span>
        </div>
      ))}
    </div>
  )
}

function CategoryPieChart({ data, isDark }) {
  const [activeIdx, setActiveIdx] = useState(null)
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-6 sm:p-7"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-finance-700/70 dark:text-finance-300/70 mb-1 number-mono">
            April 2026
          </p>
          <h3 className="display-serif text-2xl font-medium text-finance-950 dark:text-finance-50">
            Expense by Category
          </h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-finance-700/60 dark:text-finance-300/60">Total</p>
          <p className="number-mono text-lg font-semibold text-peach-700 dark:text-peach-300">
            {formatRupiah(total, { compact: true })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut chart */}
        <div className="h-64 sm:h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                onMouseEnter={(_, idx) => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.color}
                    stroke="none"
                    style={{
                      filter: activeIdx === null || activeIdx === idx ? 'none' : 'opacity(0.4)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-[0.2em] text-finance-700/60 dark:text-finance-300/60">
              {activeIdx !== null ? data[activeIdx].name : 'Categories'}
            </span>
            <span className="number-mono text-2xl font-semibold text-finance-950 dark:text-finance-50">
              {activeIdx !== null
                ? `${((data[activeIdx].value / total) * 100).toFixed(0)}%`
                : data.length}
            </span>
          </div>
        </div>

        {/* Legend / category list */}
        <div className="space-y-2">
          {data.map((entry, idx) => {
            const pct = (entry.value / total) * 100
            const isActive = activeIdx === idx
            return (
              <button
                key={entry.name}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-finance-100/60 dark:bg-finance-500/15'
                    : 'hover:bg-finance-50/40 dark:hover:bg-finance-500/8'
                }`}
              >
                <span className="text-base">{entry.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-finance-950 dark:text-finance-50 truncate">
                      {entry.name}
                    </span>
                    <span className="number-mono font-semibold text-finance-700 dark:text-finance-200">
                      {formatRupiah(entry.value, { compact: true })}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-finance-100 dark:bg-finance-900/40 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: entry.color }}
                    />
                  </div>
                </div>
                <span className="number-mono text-[10px] text-finance-700/60 dark:text-finance-300/60 w-9 text-right">
                  {pct.toFixed(0)}%
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function CashflowChart({ data, isDark }) {
  // Null each series independently — prevents dots/lines for months with no data
  const chartData = data.map(m => ({
    ...m,
    income:  m.income  === 0 ? null : m.income,
    expense: m.expense === 0 ? null : m.expense,
  }))

  const activeCount = data.filter(m => m.income > 0 || m.expense > 0).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-card rounded-2xl p-6 sm:p-7"
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-finance-700/70 dark:text-finance-300/70 mb-1 number-mono">
            Jan — Dec 2026
          </p>
          <h3 className="display-serif text-2xl font-medium text-finance-950 dark:text-finance-50">
            Monthly Cashflow
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-finance-500"></span>
            <span className="text-finance-700 dark:text-finance-200 font-medium">Income</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-peach-500"></span>
            <span className="text-peach-700 dark:text-peach-200 font-medium">Expense</span>
          </span>
          <span className="text-[10px] number-mono text-finance-700/50 dark:text-finance-300/50">
            {activeCount} bulan tercatat
          </span>
        </div>
      </div>

      <div className="h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke={isDark ? '#9ca39e' : '#6b7670'}
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke={isDark ? '#9ca39e' : '#6b7670'}
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
              domain={[0, dataMax => Math.ceil((dataMax * 1.2) / 5_000_000) * 5_000_000]}
            />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#incomeGrad)"
              connectNulls={false}
              dot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1800}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#expenseGrad)"
              connectNulls={false}
              dot={{ r: 4, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default function Charts({ categoryData, cashflowData, isDark }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
      <CategoryPieChart data={categoryData} isDark={isDark} />
      <CashflowChart data={cashflowData} isDark={isDark} />
    </div>
  )
}
