import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogoMark, Wordmark } from '../components/common/Logo.jsx'
import { EASE_IN_OUT } from '../constants/animation.js'

const WORDS = ['BULK', 'CUT', 'EVOLVE']
const WORD_DURATION = 750
const LOGO_START = WORDS.length * WORD_DURATION + 150
const SPLASH_END = LOGO_START + 1700
const YEAR = new Date().getFullYear()

export default function Splash() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const progress = useMotionValue(0)
  const counter = useTransform(progress, (value) => String(Math.round(value)).padStart(3, '0'))
  const barWidth = useTransform(progress, (value) => `${value}%`)
  const showLogo = step >= WORDS.length

  useEffect(() => {
    const goToLogin = () => navigate('/login', { replace: true })

    const timers = [
      setTimeout(() => setStep(1), WORD_DURATION),
      setTimeout(() => setStep(2), WORD_DURATION * 2),
      setTimeout(() => setStep(WORDS.length), LOGO_START),
      setTimeout(goToLogin, SPLASH_END),
    ]
    const counterAnimation = animate(progress, 100, {
      duration: (SPLASH_END - 400) / 1000,
      ease: [0.45, 0, 0.2, 1],
    })

    window.addEventListener('keydown', goToLogin)

    return () => {
      timers.forEach(clearTimeout)
      counterAnimation.stop()
      window.removeEventListener('keydown', goToLogin)
    }
  }, [navigate, progress])

  return (
    <motion.main
      onClick={() => navigate('/login', { replace: true })}
      className="relative flex min-h-screen cursor-pointer flex-col justify-between overflow-hidden bg-ink p-5 select-none sm:p-8"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: EASE_IN_OUT }}
    >
      <header className="flex items-start justify-between text-[11px] tracking-[0.14em] text-mute uppercase sm:text-xs">
        <span>
          <Wordmark className="text-paper" />
          <span className="ml-1 align-super text-[8px]">®</span>
        </span>
        <span className="hidden sm:block">AI Fitness Coach</span>
        <span>©{YEAR}</span>
      </header>

      <section className="relative flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {!showLogo ? (
            <div key={WORDS[step]} className="overflow-hidden py-[0.06em]">
              <motion.h1
                className="text-[clamp(4.5rem,19vw,17rem)] leading-[0.82] font-semibold tracking-[-0.055em] text-paper"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-105%' }}
                transition={{ duration: 0.38, ease: EASE_IN_OUT }}
              >
                {WORDS[step]}
              </motion.h1>
            </div>
          ) : (
            <motion.div key="logo" className="flex flex-col items-center gap-7">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE_IN_OUT }}
              >
                <LogoMark size={104} animate />
              </motion.div>

              <div className="flex overflow-hidden text-3xl sm:text-4xl">
                {'PHΛZE'.split('').map((letter, index) => (
                  <motion.span
                    key={letter}
                    className="inline-block font-semibold tracking-[0.18em]"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.6, delay: 0.45 + index * 0.06, ease: EASE_IN_OUT }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer>
        <div className="flex items-end justify-between">
          <motion.span className="text-[clamp(2.5rem,7vw,5.5rem)] leading-none font-light tracking-[-0.04em] tabular-nums">
            {counter}
          </motion.span>
          <ol className="space-y-1 text-right text-[11px] tracking-[0.14em] uppercase sm:text-xs">
            {WORDS.map((word, index) => (
              <li
                key={word}
                className={`transition-colors duration-300 ${index === step ? 'text-volt' : 'text-mute/50'}`}
              >
                0{index + 1} — {word}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 h-0.5 w-full bg-line">
          <motion.div className="h-full bg-volt" style={{ width: barWidth }} />
        </div>
      </footer>
    </motion.main>
  )
}
