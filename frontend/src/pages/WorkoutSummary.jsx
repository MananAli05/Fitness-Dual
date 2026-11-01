import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Alert from '../components/common/Alert.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import StatTile from '../components/common/StatTile.jsx'
import WorkoutBreakdown from '../components/history/WorkoutBreakdown.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { deleteWorkout, fetchWorkout } from '../lib/workouts.js'
import { formatDay, formatDuration, formatTime } from '../utils/dates.js'
import { groupSetsByExercise, summarizeSets } from '../utils/workouts.js'

export default function WorkoutSummary() {
  const navigate = useNavigate()
  const location = useLocation()
  const { workoutId } = useParams()
  const [loaded, setLoaded] = useState({ id: null, workout: null, error: null })
  const [deleteError, setDeleteError] = useState(null)
  const justFinished = Boolean(location.state?.justFinished)

  useEffect(() => {
    let cancelled = false

    fetchWorkout(workoutId).then(({ data, error }) => {
      if (!cancelled) setLoaded({ id: workoutId, workout: data, error })
    })

    return () => {
      cancelled = true
    }
  }, [workoutId])

  const isLoading = loaded.id !== workoutId
  const { workout, error } = loaded

  const handleDelete = async () => {
    if (!window.confirm('Delete this workout from your history?')) return

    const { error: removeError } = await deleteWorkout(workoutId)
    if (removeError) {
      setDeleteError(removeError)
    } else {
      navigate('/progress/history', { replace: true })
    }
  }

  const renderContent = () => {
    if (isLoading) return <p className="mt-8 text-sm text-mute">Loading workout…</p>
    if (error || !workout) {
      return (
        <div className="mt-8">
          <Alert>{error ?? 'This workout could not be found.'}</Alert>
        </div>
      )
    }

    const summary = summarizeSets(workout.workout_sets)
    const stats = [
      { label: 'Duration', value: formatDuration(workout.duration_seconds) },
      { label: 'Exercises', value: groupSetsByExercise(workout.workout_sets).length },
      { label: 'Sets', value: summary.sets },
      { label: 'Reps', value: summary.reps.toLocaleString() },
      { label: 'Volume', value: `${Math.round(summary.volume).toLocaleString()} kg` },
    ]

    return (
      <>
        <div className="mt-4">
          <PageHeader
            eyebrow={`${formatDay(workout.started_at)} · ${formatTime(workout.started_at)}`}
            title={justFinished ? 'Workout complete.' : workout.title}
            subtitle={justFinished ? `${workout.title} is saved to your history.` : null}
          >
            <PillButton variant="outline" to="/progress">
              View progress
            </PillButton>
            <PillButton to="/home">Back to dashboard</PillButton>
          </PageHeader>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <StatTile key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="mt-4">
          <WorkoutBreakdown sets={workout.workout_sets} />
        </div>

        {deleteError && (
          <div className="mt-6">
            <Alert>{deleteError}</Alert>
          </div>
        )}

        <button type="button" onClick={handleDelete} className="mt-6 text-sm text-mute transition hover:text-danger">
          Delete workout
        </button>
      </>
    )
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8">
        <Link to="/progress/history" className="text-sm text-mute transition hover:text-paper">
          All workouts
        </Link>
        {renderContent()}
      </div>
    </AppLayout>
  )
}
