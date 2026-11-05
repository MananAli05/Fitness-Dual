import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Alert from '../components/common/Alert.jsx'
import ChoiceGrid from '../components/common/ChoiceGrid.jsx'
import Logo from '../components/common/Logo.jsx'
import PrimaryButton from '../components/common/PrimaryButton.jsx'
import PlanSummary from '../components/onboarding/PlanSummary.jsx'
import { EASE_IN_OUT } from '../constants/animation.js'
import { ACTIVITY_LEVELS, FITNESS_LEVELS, GENDERS, GOALS, NUMBER_FIELDS } from '../constants/profile.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { calculateTargets } from '../utils/targets.js'
import { getNumberError } from '../utils/validation.js'

const STEPS = [
  { key: 'gender', question: 'What’s your gender?', subtitle: 'Used only to calculate your calorie needs.', options: GENDERS, columns: 3 },
  { key: 'age', question: 'How old are you?', subtitle: 'Your metabolism changes with age.' },
  { key: 'height_cm', question: 'How tall are you?', subtitle: 'In centimetres.' },
  { key: 'weight_kg', question: 'What’s your weight?', subtitle: 'In kilograms. You can update it any time.' },
  { key: 'activity_level', question: 'How active is your day?', subtitle: 'Outside of your workouts.', options: ACTIVITY_LEVELS },
  { key: 'fitness_level', question: 'Your training experience?', subtitle: 'So we pick the right exercises and volume.', options: FITNESS_LEVELS },
  { key: 'goal', question: 'Pick your phase.', subtitle: 'You can switch phases later.', options: GOALS, columns: 2 },
]

function formatStep(number) {
  return String(number).padStart(2, '0')
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { profile, loading, save } = useProfile()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [answers, setAnswers] = useState({
    gender: profile?.gender ?? null,
    age: profile?.age ?? '',
    height_cm: profile?.height_cm ?? '',
    weight_kg: profile?.weight_kg ?? '',
    activity_level: profile?.activity_level ?? null,
    fitness_level: profile?.fitness_level ?? null,
    goal: profile?.goal ?? 'bulk',
  })

  if (!loading && profile?.onboarded) return <Navigate to="/home" replace />

  const isSummary = step === STEPS.length
  const currentStep = STEPS[step]
  const numberField = currentStep && NUMBER_FIELDS[currentStep.key]

  const changeStep = (change) => {
    setError(null)
    setDirection(change)
    setStep(step + change)
  }

  const handleAnswer = (key, value) => {
    setError(null)
    setAnswers({ ...answers, [key]: value })
  }

  const finishOnboarding = async () => {
    setSaving(true)
    const { error: saveError } = await save({
      ...answers,
      age: Number(answers.age),
      height_cm: Number(answers.height_cm),
      weight_kg: Number(answers.weight_kg),
      onboarded: true,
    })
    setSaving(false)

    if (saveError) {
      setError(saveError)
    } else {
      navigate('/home', { replace: true })
    }
  }

  const handleNext = (e) => {
    e.preventDefault()

    if (isSummary) {
      finishOnboarding()
      return
    }

    const value = answers[currentStep.key]
    const stepError = numberField ? getNumberError(currentStep.key, value) : !value && 'Choose one option to continue'

    if (stepError) {
      setError(stepError)
    } else {
      changeStep(1)
    }
  }

  return (
    <motion.main
      className="flex min-h-dvh flex-col bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="px-5 pt-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo size={30} />
          <span className="text-xs tracking-[0.14em] text-mute uppercase tabular-nums">
            {isSummary ? 'Summary' : `Step ${formatStep(step + 1)} / ${formatStep(STEPS.length)}`}
          </span>
        </div>
        <div className="mt-6 h-0.5 w-full bg-line">
          <motion.div
            className="h-full bg-volt"
            animate={{ width: `${(step / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE_IN_OUT }}
          />
        </div>
      </header>

      <form onSubmit={handleNext} className="flex flex-1 flex-col px-5 sm:px-10" noValidate>
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: direction * 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -40, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_IN_OUT }}
            >
              {isSummary ? (
                <PlanSummary targets={calculateTargets(answers)} answers={answers} />
              ) : (
                <>
                  <h1 className="text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
                    {currentStep.question}
                  </h1>
                  <p className="mt-3 text-soft">{currentStep.subtitle}</p>

                  <div className="mt-10">
                    {numberField ? (
                      <label className="flex items-baseline gap-3 border-b border-line pb-3 focus-within:border-volt">
                        <input
                          autoFocus
                          type="number"
                          inputMode="decimal"
                          min={numberField.min}
                          max={numberField.max}
                          step={numberField.step}
                          placeholder={numberField.placeholder}
                          value={answers[currentStep.key]}
                          onChange={(e) => handleAnswer(currentStep.key, e.target.value)}
                          aria-label={numberField.label}
                          className="w-full [appearance:textfield] bg-transparent text-7xl font-semibold tracking-[-0.05em] text-paper tabular-nums outline-none placeholder:text-white/15 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <span className="text-xl text-mute">{numberField.unit}</span>
                      </label>
                    ) : (
                      <ChoiceGrid
                        options={currentStep.options}
                        value={answers[currentStep.key]}
                        onChange={(value) => handleAnswer(currentStep.key, value)}
                        columns={currentStep.columns}
                        large
                        label={currentStep.question}
                      />
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-6">
              <Alert>{error}</Alert>
            </div>
          )}
        </div>

        <footer className="mx-auto flex w-full max-w-2xl items-center gap-4 pb-8">
          <button
            type="button"
            onClick={() => changeStep(-1)}
            disabled={step === 0}
            className="h-13 rounded-full border border-line px-6 text-sm font-medium transition hover:border-paper disabled:invisible"
          >
            Back
          </button>
          <div className="flex-1">
            <PrimaryButton loading={saving}>{isSummary ? 'Go to dashboard' : 'Continue'}</PrimaryButton>
          </div>
        </footer>
      </form>
    </motion.main>
  )
}
