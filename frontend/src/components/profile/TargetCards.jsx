import { motion } from 'framer-motion'
import { EASE_OUT } from '../../constants/animation.js'

export default function TargetCards({ targets }) {
  const cards = [
    { label: 'Protein', value: targets?.protein, unit: 'g / day' },
    { label: 'Water', value: targets?.water, unit: 'glasses / day' },
    { label: 'BMI', value: targets?.bmi, unit: 'body mass index' },
  ]

  return (
    <motion.div
      className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      <div className="col-span-2 rounded-3xl bg-volt p-5 text-ink sm:col-span-1">
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase">Daily calories</p>
        <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] tabular-nums">
          {targets ? targets.calories.toLocaleString() : '—'}
        </p>
        <p className="text-xs">kcal</p>
      </div>

      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-white/6 bg-charcoal p-5">
          <p className="text-[11px] tracking-[0.14em] text-mute uppercase">{card.label}</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] tabular-nums">{card.value ?? '—'}</p>
          <p className="text-xs text-mute">{card.unit}</p>
        </div>
      ))}
    </motion.div>
  )
}
