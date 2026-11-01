import { motion } from 'framer-motion'
import Logo from '../components/common/Logo.jsx'
import { EASE_IN_OUT } from '../constants/animation.js'

const YEAR = new Date().getFullYear()

const HEADLINES = [
  { word: 'BULK.', index: '01', outline: false },
  { word: 'CUT.', index: '02', outline: true },
  { word: 'EVOLVE.', index: '03', outline: false },
]

const FACTS = [
  { value: '02', label: 'Training phases' },
  { value: '24/7', label: 'AI form coach' },
  { value: '100%', label: 'Personalised' },
]

const TICKER_ITEMS = [
  'Personalised plans',
  'Real-time form feedback',
  'Smart nutrition',
  'Auto rep counting',
  'Progress analytics',
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <motion.main
      className="grid min-h-dvh grid-cols-1 lg:h-dvh lg:grid-cols-[1.15fr_1fr] lg:overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <aside className="relative hidden min-h-0 flex-col justify-between overflow-hidden bg-volt text-ink lg:flex">
        <div className="flex items-start justify-between px-10 pt-[4.5vh] text-xs tracking-[0.14em] uppercase">
          <Logo />
          <span className="text-ink/50">Est. {YEAR}</span>
        </div>

        <div className="px-10">
          {HEADLINES.map(({ word, index, outline }, position) => (
            <div key={word} className="overflow-hidden">
              <motion.p
                className="flex items-start gap-3 text-[clamp(3rem,min(8.2vw,13vh),8.5rem)] leading-[0.86] font-semibold tracking-[-0.055em]"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, delay: 0.15 + position * 0.1, ease: EASE_IN_OUT }}
              >
                <span
                  className={outline ? 'text-transparent' : ''}
                  style={outline ? { WebkitTextStroke: '1.5px var(--color-ink)' } : undefined}
                >
                  {word}
                </span>
                <span className="mt-[0.6em] text-xs font-medium tracking-normal text-ink/40">({index})</span>
              </motion.p>
            </div>
          ))}

          <div className="mt-[5vh] grid max-w-xl grid-cols-3 gap-6">
            {FACTS.map(({ value, label }) => (
              <div key={label} className="border-t border-ink/15 pt-3">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <p className="mt-1 text-xs text-ink/50">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden border-t border-ink/10 py-[1.8vh]">
          <div className="flex w-max animate-marquee gap-10 text-xs tracking-[0.14em] whitespace-nowrap uppercase">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <span key={index} className="flex items-center gap-10">
                {item}
                <span aria-hidden="true">✳</span>
              </span>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex min-h-0 flex-col bg-charcoal px-5 py-6 sm:px-10 lg:py-[4.5vh]">
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden">
            <Logo size={30} />
          </div>
          <span className="text-xs tracking-[0.14em] text-mute uppercase">AI Fitness Coach</span>
        </div>

        <div className="flex flex-1 items-center justify-center py-6 lg:py-0">
          <motion.div
            className="w-full max-w-[420px]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_IN_OUT }}
          >
            <h1 className="text-[clamp(2rem,5vh,2.6rem)] leading-none font-semibold tracking-[-0.04em]">{title}</h1>
            <p className="mt-3 text-soft">{subtitle}</p>
            <div className="mt-[3.5vh]">{children}</div>
          </motion.div>
        </div>

        <p className="text-xs text-mute">© {YEAR} PHAZE. All rights reserved.</p>
      </section>
    </motion.main>
  )
}
