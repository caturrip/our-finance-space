import { motion } from 'framer-motion'
import { Pin } from 'lucide-react'

export default function FinanceNotes({ notes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {notes.map((note, i) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={`sticky-note ${note.color} ${note.darkColor} relative p-5 sm:p-6 rounded-sm shadow-lg cursor-pointer transition-all duration-300 ease-out`}
          style={{
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 8px 24px -4px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className={`w-6 h-6 rounded-full ${note.accent} shadow-md flex items-center justify-center`}>
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Tape decoration */}
          <div className="absolute top-1 right-4 w-12 h-3 bg-white/40 rotate-3 rounded-sm" />

          {/* Title */}
          <h4 className="display-serif text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 mt-2">
            {note.title}
          </h4>

          {/* Body */}
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {note.body}
          </p>

          {/* Author / footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-300/30 dark:border-white/10">
            <span className="text-[10px] uppercase tracking-widest text-gray-600 dark:text-gray-400 number-mono">
              by {note.author}
            </span>
            <span className="text-base">📌</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
