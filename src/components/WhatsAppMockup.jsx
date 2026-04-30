import { motion } from 'framer-motion'
import { Check, CheckCheck, Bot, Phone, Video, MoreVertical } from 'lucide-react'
import { formatRupiah } from '../utils/format'
import { chatMessages } from '../data/dummyData'

function BotReportBubble({ report }) {
  return (
    <div className="space-y-2 min-w-[240px]">
      <p className="text-sm font-semibold text-finance-700">📊 Laporan Bulan Ini</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">💰 Income</span>
          <span className="number-mono font-semibold text-finance-600">
            {formatRupiah(report.income)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">📉 Expense</span>
          <span className="number-mono font-semibold text-peach-600">
            {formatRupiah(report.expense)}
          </span>
        </div>
        <div className="h-px bg-gray-200 my-1" />
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-semibold">
            {report.balance >= 0 ? '💚' : '⚠️'} Net Bulan Ini
          </span>
          <span className={`number-mono font-bold ${report.balance >= 0 ? 'text-finance-700' : 'text-red-500'}`}>
            {formatRupiah(report.balance)}
          </span>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 italic">
          Top kategori: {report.topCategory}
        </p>
      </div>
    </div>
  )
}

function ChatBubble({ msg, index }) {
  const isBot = msg.from === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.15 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        {!isBot && msg.author && (
          <p className="text-[10px] font-semibold text-finance-600 mb-0.5 ml-1">
            {msg.author}
          </p>
        )}
        <div
          className={`relative px-3 py-2 rounded-xl whitespace-pre-line text-sm leading-snug ${
            isBot
              ? 'bg-white text-gray-800 rounded-tl-sm shadow-sm'
              : 'bg-[#dcf8c6] text-gray-800 rounded-tr-sm shadow-sm'
          }`}
        >
          {msg.isReport ? <BotReportBubble report={msg.report} /> : msg.text}

          <div className="flex items-center justify-end gap-1 mt-1 -mb-0.5">
            <span className="text-[10px] text-gray-500 number-mono">{msg.time}</span>
            {!isBot && <CheckCheck size={12} className="text-blue-500" />}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function WhatsAppMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center"
    >
      {/* Left side — explanation */}
      <div className="lg:col-span-2 space-y-5">
        <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5">
          <Bot size={14} className="text-finance-600" />
          <span className="text-xs font-semibold text-finance-700 dark:text-finance-300 uppercase tracking-widest">
            WhatsApp Bot
          </span>
        </div>

        <h3 className="display-serif text-3xl sm:text-4xl font-light leading-tight text-finance-950 dark:text-finance-50">
          Track expenses by simply{' '}
          <span className="italic text-gradient-romance">chatting</span>.
        </h3>

        <p className="text-finance-800/70 dark:text-finance-100/70 leading-relaxed">
          Bot WhatsApp kami terhubung langsung ke dashboard ini melalui Railway.
          Cukup kirim pesan, bot otomatis mencatat, mengkategorikan, dan
          memperbarui laporan keuangan kalian secara real-time.
        </p>

        <div className="space-y-3">
          {[
            { emoji: '⚡', title: 'Real-time sync', desc: 'Setiap pesan langsung tercatat ke dashboard' },
            { emoji: '🤖', title: 'AI Categorization', desc: 'Bot otomatis mengkategorikan transaksi' },
            { emoji: '💑', title: 'Couple Friendly', desc: 'Catur & Vermita bisa input dari WhatsApp masing-masing' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl glass-card"
            >
              <span className="text-xl">{item.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-finance-950 dark:text-finance-50">{item.title}</p>
                <p className="text-xs text-finance-700/70 dark:text-finance-200/70 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right side — chat mockup (phone frame) */}
      <div className="lg:col-span-3 flex items-center justify-center">
        <motion.div
          initial={{ rotateY: 15, rotateX: 5 }}
          animate={{ rotateY: [15, -5, 15], rotateX: [5, -2, 5] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
          className="relative w-full max-w-sm mx-auto"
        >
          {/* Phone glow */}
          <div className="absolute -inset-4 bg-gradient-to-br from-finance-400/40 via-peach-300/40 to-blush-300/40 blur-3xl rounded-[3rem] opacity-60" />

          {/* Phone frame */}
          <div className="relative bg-gray-900 dark:bg-black rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              {/* WA Header */}
              <div className="bg-[#075e54] px-3 py-2.5 flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-finance-400 to-peach-400 flex items-center justify-center text-base font-bold">
                  💚
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Finance Bot</p>
                  <p className="text-[10px] text-finance-100/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-finance-300 animate-pulse" />
                    online
                  </p>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Video size={16} />
                  <Phone size={16} />
                  <MoreVertical size={16} />
                </div>
              </div>

              {/* Chat body */}
              <div
                className="px-3 py-4 space-y-2.5 max-h-[480px] overflow-y-auto"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3Cpattern id='p' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 20 L20 0 L40 20 L20 40 Z' fill='none' stroke='%23e5dcd0' stroke-width='0.5' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='%23ece5dd'/%3E%3Crect width='100' height='100' fill='url(%23p)'/%3E%3C/svg%3E")`,
                }}
              >
                {/* Date pill */}
                <div className="flex justify-center mb-1">
                  <span className="bg-white/80 backdrop-blur-sm text-[10px] text-gray-600 px-2 py-1 rounded-md shadow-sm">
                    Today
                  </span>
                </div>

                {chatMessages.map((msg, i) => (
                  <ChatBubble key={msg.id} msg={msg} index={i} />
                ))}

                {/* Typing indicator (decoration) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, delay: 4 }}
                  className="flex justify-start"
                >
                  <div className="bg-white px-3 py-2 rounded-xl rounded-tl-sm shadow-sm flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Input bar */}
              <div className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-xs text-gray-400">
                  Ketik pesan...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#075e54] flex items-center justify-center">
                  <span className="text-white text-xs">🎤</span>
                </div>
              </div>
            </div>

            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-black rounded-b-2xl"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
