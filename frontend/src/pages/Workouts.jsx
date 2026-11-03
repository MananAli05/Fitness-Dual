import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader.jsx'
import TextField from '../components/common/TextField.jsx'
import CategoryFilter from '../components/workouts/CategoryFilter.jsx'
import ExerciseCard from '../components/workouts/ExerciseCard.jsx'
import StartWorkoutCard from '../components/workouts/StartWorkoutCard.jsx'
import { EXERCISE_CATEGORIES, EXERCISES, GOAL_TRAINING } from '../constants/exercises.js'
import { useProfile } from '../context/ProfileContext.jsx'
import { useWorkout } from '../context/WorkoutContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { getTodaysPlan } from '../utils/workouts.js'

export default function Workouts() {
  const navigate = useNavigate()
  const { goal } = useProfile()
  const { activeWorkout, startWorkout } = useWorkout()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const plan = getTodaysPlan(goal)
  const query = search.trim().toLowerCase()
  const exercises = EXERCISES.filter(
    (exercise) =>
      (category === 'All' || exercise.category === category) &&
      (exercise.name.toLowerCase().includes(query) ||
        exercise.muscles.some((muscle) => muscle.toLowerCase().includes(query))),
  )

  const start = (title, exerciseIds) => {
    startWorkout({ title, exerciseIds })
    navigate('/workouts/session')
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader eyebrow={GOAL_TRAINING[goal].label} title="Workouts" subtitle={GOAL_TRAINING[goal].summary} />

        <div className="mt-8">
          <StartWorkoutCard
            plan={plan}
            activeWorkout={activeWorkout}
            onStartPlan={() => start(plan.title, plan.exerciseIds)}
            onStartEmpty={() => start('Workout', [])}
          />
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Exercise library</h2>
              <p className="mt-1 text-sm text-mute">{EXERCISES.length} exercises with step-by-step instructions.</p>
            </div>
            <div className="w-full lg:w-72">
              <TextField
                id="library-search"
                label="Search"
                placeholder="Exercise or muscle"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5">
            <CategoryFilter categories={EXERCISE_CATEGORIES} value={category} onChange={setCategory} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} goal={goal} />
            ))}
          </div>
          {exercises.length === 0 && <p className="mt-5 text-sm text-mute">No exercises match your search.</p>}
        </section>
      </div>
    </AppLayout>
  )
}
