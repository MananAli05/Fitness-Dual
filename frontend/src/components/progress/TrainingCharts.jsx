import { formatDay } from '../../utils/dates.js'
import { getWeeklyMinutes, summarizeSets } from '../../utils/workouts.js'
import ChartCard from './ChartCard.jsx'

const WEEK_COUNT = 8
const SESSION_COUNT = 10

export default function TrainingCharts({ workouts }) {
  const weeklyMinutes = getWeeklyMinutes(workouts, WEEK_COUNT)
  const averageMinutes = Math.round(weeklyMinutes.reduce((total, week) => total + week.value, 0) / WEEK_COUNT)

  const sessions = workouts
    .slice(0, SESSION_COUNT)
    .reverse()
    .map((workout) => ({
      key: workout.id,
      label: new Date(workout.started_at).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric' }),
      tooltip: `${workout.title}, ${formatDay(workout.started_at)}`,
      value: Math.round(summarizeSets(workout.workout_sets).volume),
    }))
  const bestVolume = Math.max(0, ...sessions.map((session) => session.value))

  return (
    <>
      <ChartCard
        title="Training minutes per week"
        headline={`${averageMinutes} min`}
        caption={`Weekly average, last ${WEEK_COUNT} weeks`}
        data={weeklyMinutes.map((week) => ({ ...week, tooltip: `Week of ${week.label}` }))}
        unit="min"
        delay={0.08}
      />
      <ChartCard
        title="Volume per session"
        headline={`${bestVolume.toLocaleString()} kg`}
        caption={`Best of your last ${SESSION_COUNT} sessions (reps × kg)`}
        data={sessions}
        unit="kg"
        delay={0.12}
      />
    </>
  )
}
