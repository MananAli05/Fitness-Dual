import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/common/Alert.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import WorkoutListItem from '../components/history/WorkoutListItem.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { fetchWorkouts } from '../lib/workouts.js'

const HISTORY_LIMIT = 50

export default function History() {
  const [workouts, setWorkouts] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchWorkouts({ limit: HISTORY_LIMIT }).then((result) => {
      if (cancelled) return
      setWorkouts(result.data)
      setError(result.error)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8">
        <Link to="/progress" className="text-sm text-mute transition hover:text-paper">
          Back to progress
        </Link>

        <div className="mt-4">
          <PageHeader eyebrow="Progress" title="Workout history">
            <PillButton to="/workouts">New workout</PillButton>
          </PageHeader>
        </div>

        {error && (
          <div className="mt-6">
            <Alert>{error}</Alert>
          </div>
        )}

        <Card className="mt-8">
          {!workouts && <p className="text-sm text-mute">Loading workouts…</p>}
          {workouts?.length === 0 && (
            <p className="text-sm text-mute">No workouts yet. Finish your first workout and it will show up here.</p>
          )}
          {workouts?.length > 0 && (
            <ul className="divide-y divide-line">
              {workouts.map((workout) => (
                <WorkoutListItem key={workout.id} workout={workout} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
