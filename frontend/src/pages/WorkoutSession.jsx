import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import TextField from '../components/common/TextField.jsx'
import ExercisePicker from '../components/workouts/ExercisePicker.jsx'
import SessionExercise from '../components/workouts/SessionExercise.jsx'
import SessionMobileBar from '../components/workouts/SessionMobileBar.jsx'
import SessionPanel from '../components/workouts/SessionPanel.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useWorkout } from '../context/WorkoutContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { getTodaysPlan } from '../utils/workouts.js'

function NoActiveWorkout({ onStartPlan }) {
  return (
    <Card className="mt-8 max-w-xl">
      <p className="text-xl font-semibold tracking-tight">No workout in progress</p>
      <p className="mt-2 text-sm text-mute">Start today&apos;s plan, or pick exercises from the library.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <PillButton onClick={onStartPlan}>Start today&apos;s plan</PillButton>
        <PillButton variant="outline" to="/workouts">
          Browse exercises
        </PillButton>
      </div>
    </Card>
  )
}

export default function WorkoutSession() {
  const navigate = useNavigate()
  const { goal, level } = useProfile()
  const workout = useWorkout()
  const { activeWorkout } = workout
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const handleStartPlan = () => {
    const plan = getTodaysPlan(goal, level)
    workout.startWorkout({ title: plan.title, exerciseIds: plan.exerciseIds })
  }

  const handleAddExercise = (exerciseId) => {
    workout.addExercise(exerciseId)
    setShowPicker(false)
  }

  const handleFinish = async () => {
    setSaving(true)
    setError(null)
    const { id, error: saveError } = await workout.finishWorkout()
    setSaving(false)

    if (saveError) {
      setError(saveError)
    } else {
      navigate(`/progress/history/${id}`, { replace: true, state: { justFinished: true } })
    }
  }

  const handleDiscard = () => {
    if (window.confirm('Discard this workout? Your logged sets will not be saved.')) {
      workout.discardWorkout()
      navigate('/workouts')
    }
  }

  const mobileBar = activeWorkout && (
    <SessionMobileBar workout={activeWorkout} saving={saving} onFinish={handleFinish} />
  )

  return (
    <AppLayout mobileBar={mobileBar}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader eyebrow="Manual workout" title={activeWorkout ? activeWorkout.title || 'Workout' : 'Workout'} />

        {!activeWorkout ? (
          <NoActiveWorkout onStartPlan={handleStartPlan} />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
            <div className="lg:order-2 lg:col-span-4">
              <SessionPanel
                workout={activeWorkout}
                saving={saving}
                error={error}
                onFinish={handleFinish}
                onDiscard={handleDiscard}
              />
            </div>

            <div className="space-y-4 lg:order-1 lg:col-span-8">
              <TextField
                id="workout-title"
                label="Workout name"
                maxLength={80}
                value={activeWorkout.title}
                onChange={(e) => workout.renameWorkout(e.target.value)}
              />

              {activeWorkout.exercises.map((entry, index) => (
                <SessionExercise
                  key={entry.key}
                  entry={entry}
                  position={index}
                  onUpdateSet={(setIndex, changes) => workout.updateSet(entry.key, setIndex, changes)}
                  onAddSet={() => workout.addSet(entry.key)}
                  onRemoveSet={(setIndex) => workout.removeSet(entry.key, setIndex)}
                  onRemove={() => workout.removeExercise(entry.key)}
                />
              ))}

              {showPicker ? (
                <ExercisePicker onAdd={handleAddExercise} onClose={() => setShowPicker(false)} />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPicker(true)}
                  className="h-14 w-full rounded-3xl border border-dashed border-line text-sm font-medium text-soft transition hover:border-volt hover:text-paper"
                >
                  Add exercise
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
