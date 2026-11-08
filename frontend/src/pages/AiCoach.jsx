import { useState } from 'react'
import AiExerciseCard from '../components/aiCoach/AiExerciseCard.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import { AI_EXERCISES } from '../constants/aiExercises.js'
import { findExercise } from '../constants/exercises.js'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { formatTarget } from '../utils/workouts.js'

const TIPS = ['Stand 2 to 3 metres from the camera', 'Keep your whole body in the frame', 'Use a well lit room']

export default function AiCoach() {
  const { goal, level } = useProfile()
  const [selectedId, setSelectedId] = useState(null)

  const exercises = AI_EXERCISES.map((item) => ({ ...item, exercise: findExercise(item.id) }))
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
              checks={item.checks}
              poses={item.poses}
              selected={item.id === selectedId}
              onSelect={() => setSelectedId(item.id)}
            />
          ))}
        </div>

        {selected && (
          <Card className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xl font-semibold tracking-tight">{selected.exercise.name}</p>
                <p className="mt-1 text-sm text-mute">
                  {formatTarget(selected.exercise, goal, level)} · The live camera is coming in the next update.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="h-12 rounded-full bg-volt px-8 text-sm font-semibold text-ink opacity-40"
              >
                Start camera
              </button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
