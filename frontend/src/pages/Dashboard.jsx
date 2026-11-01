import { useNavigate } from 'react-router-dom'
import PhaseCard from '../components/dashboard/PhaseCard.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import WorkoutCard from '../components/dashboard/WorkoutCard.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import { useWorkout } from '../context/WorkoutContext.jsx'
import { dashboardByGoal } from '../data/mockDashboard.js'
import AppLayout from '../layouts/AppLayout.jsx'
import { getTodaysPlan } from '../utils/workouts.js'

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { name, goal, targets } = useProfile()
  const { activeWorkout, startWorkout } = useWorkout()
  const dashboard = dashboardByGoal[goal] ?? dashboardByGoal.bulk

  const startTodaysWorkout = () => {
    if (!activeWorkout) {
      const plan = getTodaysPlan(goal)
      startWorkout({ title: plan.title, exerciseIds: plan.exerciseIds })
    }
    navigate('/workouts/session')
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.14em] text-mute uppercase">{TODAY}</p>
            <h1 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] leading-none font-semibold tracking-[-0.04em]">
              {getGreeting()}, <span className="capitalize">{name}</span>
            </h1>
          </div>
          <span className="rounded-full border border-dashed border-white/15 px-3 py-1.5 text-[11px] tracking-wider text-mute uppercase">
            Preview · sample data
          </span>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <PhaseCard phase={dashboard.phase} onStartWorkout={startTodaysWorkout} />
          <WorkoutCard workout={dashboard.workout} onManual={startTodaysWorkout} />

          <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
            <StatCard
              label="Calories"
              value={dashboard.calories.value}
              target={targets?.calories ?? dashboard.calories.target}
              unit="kcal today"
              delay={0.12}
            />
            <StatCard
              label="Protein"
              value={dashboard.protein.value}
              target={targets?.protein ?? dashboard.protein.target}
              unit="grams today"
              delay={0.16}
            />
            <StatCard
              label="Water"
              value={dashboard.water.value}
              target={targets?.water ?? dashboard.water.target}
              unit="glasses today"
              delay={0.2}
            />
            <StatCard label="Streak" value={dashboard.streakDays} unit="days in a row" delay={0.24} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
