import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import StatTile from '../components/common/StatTile.jsx'
import { findExercise, GOAL_TRAINING } from '../constants/exercises.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { useWorkout } from '../context/WorkoutContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { formatTarget } from '../utils/workouts.js'

export default function ExerciseDetail() {
  const navigate = useNavigate()
  const { exerciseId } = useParams()
  const { goal } = useProfile()
  const { activeWorkout, startWorkout, addExercise } = useWorkout()
  const exercise = findExercise(exerciseId)

  if (!exercise) return <Navigate to="/workouts" replace />

  const details = [
    { label: 'Target', value: formatTarget(exercise, goal) },
    { label: 'Level', value: exercise.level },
    { label: 'Equipment', value: exercise.equipment },
    { label: 'Muscles', value: exercise.muscles.join(', ') },
  ]

  const handleAdd = () => {
    if (activeWorkout) {
      addExercise(exercise.id)
    } else {
      startWorkout({ title: exercise.name, exerciseIds: [exercise.id] })
    }
    navigate('/workouts/session')
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8">
        <Link to="/workouts" className="text-sm text-mute transition hover:text-paper">
          Back to workouts
        </Link>

        <div className="mt-4">
          <PageHeader eyebrow={exercise.category} title={exercise.name}>
            <PillButton onClick={handleAdd}>{activeWorkout ? 'Add to workout' : 'Start this exercise'}</PillButton>
          </PageHeader>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {details.map((detail) => (
            <StatTile key={detail.label} label={detail.label} value={detail.value} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Card title="How to do it" className="lg:col-span-3" delay={0.06}>
            <ol className="space-y-4">
              {exercise.instructions.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="w-6 shrink-0 text-sm text-volt tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-soft">{step}</span>
                </li>
              ))}
            </ol>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card title="Common mistakes" delay={0.1}>
              <ul className="divide-y divide-line">
                {exercise.mistakes.map((mistake) => (
                  <li key={mistake} className="py-2.5 text-sm text-soft first:pt-0 last:pb-0">
                    {mistake}
                  </li>
                ))}
              </ul>
            </Card>

            <Card title={GOAL_TRAINING[goal].label} delay={0.14}>
              <p className="text-sm text-soft">{GOAL_TRAINING[goal].summary}</p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
