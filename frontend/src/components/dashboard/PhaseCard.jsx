import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE_OUT } from '../../constants/animation.js'

export default function PhaseCard({ phase, onStartWorkout }) {
  const percent = Math.round((phase.week / phase.totalWeeks) * 100)

  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl bg-volt p-6 text-ink sm:p-8 lg:col-span-8"
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <span
        className="pointer-events-none absolute -right-4 -bottom-10 text-[13rem] leading-none font-semibold tracking-[-0.06em] text-transparent select-none sm:text-[16rem]"
        style={{ WebkitTextStroke: '1.5px rgb(10 10 10 / 0.18)' }}
        aria-hidden="true"
      >
        {String(phase.week).padStart(2, '0')}
      </span>

      <div className="relative">
        <p className="text-xs font-medium tracking-[0.14em] uppercase">
          {phase.index} — {phase.name} phase
        </p>
        <h2 className="mt-4 max-w-md text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
          {phase.headline}
        </h2>

        <div className="mt-8 max-w-md">
          <div className="flex justify-between text-sm font-medium">
            <span>
              Week {phase.week} of {phase.totalWeeks}
            </span>
            <span className="tabular-nums">{percent}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/12">
            <motion.div
              className="h-full rounded-full bg-ink"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onStartWorkout}
          className="group mt-8 inline-flex h-12 items-center gap-4 rounded-full bg-ink pr-1.5 pl-6 font-medium text-paper transition hover:bg-black">
          Start today&apos;s workout
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-volt text-ink transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </button>
      </div>
    </motion.section>
  )
}
