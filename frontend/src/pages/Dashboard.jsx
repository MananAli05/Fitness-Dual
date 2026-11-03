import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/common/Alert.jsx'
import PhaseCard from '../components/dashboard/PhaseCard.jsx'
import TodayStats from '../components/dashboard/TodayStats.jsx'
import WorkoutCard from '../components/dashboard/WorkoutCard.jsx'
import { DEFAULT_WATER_TARGET } from '../constants/nutrition.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useWorkout } from '../context/WorkoutContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { fetchFoodLogs, fetchWaterLogs } from '../lib/nutrition.js'
import { fetchSettings } from '../lib/settings.js'
import { fetchWorkouts } from '../lib/workouts.js'
import { daysAgo, toDateKey } from '../utils/dates.js'
import { buildNotifications } from '../utils/notifications.js'
import { sumMacros } from '../utils/nutrition.js'
import { getPhaseProgress } from '../utils/phase.js'
import { getStreakDays, getTodaysPlan } from '../utils/workouts.js'

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
const STREAK_LOOKBACK_DAYS = 120

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { profile, name, goal, targets } = useProfile()
  const { activeWorkout, startWorkout } = useWorkout()
  const { syncNotifications } = useNotifications()
  const [today] = useState(() => toDateKey())
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const phaseStartedAt = profile?.phase_started_at
  const calorieTarget = targets?.calories
  const waterTarget = targets?.water ?? DEFAULT_WATER_TARGET
  const phase = getPhaseProgress(goal, phaseStartedAt)
  const plan = getTodaysPlan(goal)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      fetchFoodLogs(today),
      fetchWaterLogs(today),
      fetchWorkouts({ since: daysAgo(STREAK_LOOKBACK_DAYS) }),
      fetchSettings(user.id),
    ]).then(([food, water, workouts, settings]) => {
      if (cancelled) return
      setData({
        totals: sumMacros(food.data),
        glasses: water.data[0]?.glasses ?? 0,
        streak: getStreakDays(workouts.data),
        doneToday: workouts.data.some((workout) => toDateKey(new Date(workout.started_at)) === today),
        settings: settings.data,
      })
      setError(food.error ?? water.error ?? workouts.error)
    })

    return () => {
      cancelled = true
    }
  }, [today, user.id])

  useEffect(() => {
    if (!data) return

    syncNotifications(
      buildNotifications({
        ...data,
        today,
        hour: new Date().getHours(),
        phase: getPhaseProgress(goal, phaseStartedAt),
        plan: getTodaysPlan(goal),
        calorieTarget,
        waterTarget,
      }),
    )
  }, [data, today, goal, phaseStartedAt, calorieTarget, waterTarget, syncNotifications])

  const startTodaysWorkout = () => {
    if (!activeWorkout) {
      startWorkout({ title: plan.title, exerciseIds: plan.exerciseIds })
    }
    navigate('/workouts/session')
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <header>
          <p className="text-xs tracking-[0.14em] text-mute uppercase">{TODAY}</p>
          <h1 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] leading-none font-semibold tracking-[-0.04em]">
            {getGreeting()}, <span className="capitalize">{name}</span>
          </h1>
        </header>

        {error && (
          <div className="mt-6">
            <Alert>{error}</Alert>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <PhaseCard
            phase={phase}
            buttonLabel={activeWorkout ? 'Resume workout' : "Start today's workout"}
            onStartWorkout={startTodaysWorkout}
          />
          <WorkoutCard workout={plan} doneToday={data?.doneToday} onManual={startTodaysWorkout} />

          {data ? (
            <TodayStats totals={data.totals} glasses={data.glasses} streak={data.streak} targets={targets} />
          ) : (
            <p className="text-sm text-mute lg:col-span-12">Loading today&apos;s stats…</p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
