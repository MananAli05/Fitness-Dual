import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AiExerciseCard from '../components/aiCoach/AiExerciseCard.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import { AI_EXERCISES } from '../constants/aiExercises.js'
import { AI_RULES } from '../constants/aiRules.js'
import { findExercise } from '../constants/exercises.js'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { formatTarget } from '../utils/workouts.js'

const TIPS = ['Stand 2 to 3 metres from the camera', 'Keep your whole body in the frame', 'Use a well lit room']

export default function AiCoach() {
  const { goal, level } = useProfile()
  const [selectedId, setSelectedId] = useState(null)
  const detailsRef = useRef(null)

  useEffect(() => {
    if (selectedId)
      detailsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }, [selectedId])

  const exercises = AI_EXERCISES.map((item) => ({
    ...item,
    exercise: findExercise(item.id),
  }))
  const selected = exercises.find((item) => item.id === selectedId)

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader
          eyebrow="AI Coach"
          title="Train with your camera"
          subtitle="Pick an exercise. The camera counts your reps and checks your form while you train."
        />

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-soft">
          {TIPS.map((tip, index) => (
            <li key={tip} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/8 text-[11px] font-semibold tabular-nums">
                {index + 1}
              </span>
              {tip}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {exercises.map((item) => (
            <AiExerciseCard
              key={item.id}
              exercise={item.exercise}
              target={formatTarget(item.exercise, goal, level)}
              image={item.image}
              checks={item.checks}
              selected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
            />
          ))}
        </div>

        {selected && (
          <div ref={detailsRef} className="scroll-mt-24 pt-6">
            <Card>
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
                <div className="overflow-hidden rounded-2xl bg-ink">
                  {selected.video ? (
                    <video
                      key={selected.id}
                      src={selected.video}
                      poster={selected.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="aspect-video w-full object-cover"
                    />
                  ) : (
                    <img
                      src={selected.image}
                      alt={selected.exercise.name}
                      className="aspect-video w-full object-cover"
                    />
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wider text-volt uppercase">How to do it</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{selected.exercise.name}</p>
                  <p className="mt-1 text-sm text-mute">{formatTarget(selected.exercise, goal, level)}</p>

                  <ol className="mt-5 space-y-3">
                    {selected.steps.map((step, index) => (
                      <li key={step} className="flex gap-3 text-sm text-soft">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold tabular-nums">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  {AI_RULES[selected.id] ? (
                    <Link
                      to={`/ai-coach/${selected.id}`}
                      className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-volt px-8 text-sm font-semibold text-ink sm:inline-flex sm:w-auto"
                    >
                      Start camera
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled
                        className="mt-6 h-12 w-full rounded-full bg-volt px-8 text-sm font-semibold text-ink opacity-40 sm:w-auto"
                      >
                        Start camera
                      </button>
                      <p className="mt-2 text-xs text-mute">The live camera for this exercise is coming soon.</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
