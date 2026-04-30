import { motion } from 'framer-motion'

export default function SectionHeader({ eyebrow, title, italic, subtitle, align = 'center' }) {
  const alignClass = align === 'left'
    ? 'text-left items-start'
    : 'text-center items-center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col gap-3 mb-10 sm:mb-12 ${alignClass}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-finance-700/80 dark:text-finance-300/80 number-mono">
          <span className="h-px w-6 bg-finance-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="display-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.05] text-finance-950 dark:text-finance-50">
        {title}
        {italic && (
          <>
            {' '}
            <span className="italic text-gradient-romance">{italic}</span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-finance-800/70 dark:text-finance-100/70 max-w-2xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
