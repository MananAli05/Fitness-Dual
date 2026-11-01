import { motion } from 'framer-motion'
import { EASE_OUT } from '../../constants/animation.js'

export default function Card({ title, className = '', delay = 0, children }) {
  return (
    <motion.section
      className={`rounded-3xl border border-white/6 bg-charcoal p-5 sm:p-6 ${className}`}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      {title && <h2 className="mb-5 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">{title}</h2>}
      {children}
    </motion.section>
  )
}
