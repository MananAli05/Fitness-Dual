import { useEffect, useState } from 'react'
import Alert from '../components/common/Alert.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import StatTile from '../components/common/StatTile.jsx'
import WorkoutListItem from '../components/history/WorkoutListItem.jsx'
import NutritionCharts from '../components/progress/NutritionCharts.jsx'
import TrainingCharts from '../components/progress/TrainingCharts.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { fetchFoodLogs, fetchWaterLogs } from '../lib/nutrition.js'
import { fetchWorkouts } from '../lib/workouts.js'
import { lastDateKeys, startOfWeek } from '../utils/dates.js'
import { getStreakDays, summarizeSets } from '../utils/workouts.js'

const DAY_COUNT = 7
const RECENT_COUNT = 3

function getChartStart() {
  const start = startOfWeek(new Date())
  start.setDate(start.getDate() - 7 * 7)
  return start
}

function getWeekStats(workouts) {
  const weekStart = startOfWeek(new Date())
  const thisWeek = workouts.filter((workout) => new Date(workout.started_at) >= weekStart)
  const minutes = thisWeek.reduce((total, workout) => total + Math.round(workout.duration_seconds / 60), 0)
  const volume = thisWeek.reduce((total, workout) => total + summarizeSets(workout.workout_sets).volume, 0)

  return [
    { label: 'Workouts', value: thisWeek.length, unit: 'this week' },
    { label: 'Minutes', value: minutes, unit: 'this week' },
    { label: 'Volume', value: Math.round(volume).toLocaleString(), unit: 'kg this week' },
    { label: 'Streak', value: getStreakDays(workouts), unit: 'days in a row' },
  ]
}

export default function Progress() {
  const { targets } = useProfile()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [dateKeys] = useState(() => lastDateKeys(DAY_COUNT))

  useEffect(() => {
    let cancelled = false
    const firstDay = dateKeys[0]
    const lastDay = dateKeys[dateKeys.length - 1]

    Promise.all([
      fetchWorkouts({ since: getChartStart() }),
      fetchFoodLogs(firstDay, lastDay),
      fetchWaterLogs(firstDay, lastDay),
    ]).then(([workouts, foodLogs, waterLogs]) => {
      if (cancelled) return
      setData({ workouts: workouts.data, foodLogs: foodLogs.data, waterLogs: waterLogs.data })
      setError(workouts.error ?? foodLogs.error ?? waterLogs.error)
    })

    return () => {
      cancelled = true
    }
  }, [dateKeys])

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader eyebrow="Your progress" title="Progress">
          <PillButton variant="outline" to="/progress/history">
            Workout history
          </PillButton>
        </PageHeader>

        {error && (
          <div className="mt-6">
            <Alert>{error}</Alert>
          </div>
        )}

        {!data ? (
          <p className="mt-8 text-sm text-mute">Loading progress…</p>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {getWeekStats(data.workouts).map((stat) => (
                <StatTile key={stat.label} {...stat} />
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TrainingCharts workouts={data.workouts} />
              <NutritionCharts
                dateKeys={dateKeys}
                foodLogs={data.foodLogs}
                waterLogs={data.waterLogs}
                targets={targets}
              />
            </div>

            <Card title="Recent workouts" className="mt-4" delay={0.24}>
              {data.workouts.length === 0 ? (
                <p className="text-sm text-mute">No workouts yet. Finish a workout to start tracking progress.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {data.workouts.slice(0, RECENT_COUNT).map((workout) => (
                    <WorkoutListItem key={workout.id} workout={workout} />
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  )
}
