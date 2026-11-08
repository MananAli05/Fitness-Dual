import { Link } from 'react-router-dom'
import Card from '../common/Card.jsx'

export default function WorkoutCard({ workout, doneToday, onManual }) {
  return (
    <Card className="lg:col-span-4" delay={0.08}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[11px] font-medium tracking-[0.14em] text-mute uppercase">Today&apos;s workout</h2>
        <span className={`text-xs ${doneToday ? 'font-medium text-volt' : 'text-mute'}`}>
          {doneToday ? 'Done today' : `${workout.minutes} min`}
        </span>
      </div>

      <p className="text-xl font-semibold tracking-tight">{workout.title}</p>

      <ul className="mt-4 divide-y divide-white/6">
        {workout.exercises.map((exercise, index) => (
          <li key={exercise.id} className="flex items-center gap-3 py-3">
            <span className="w-5 text-xs text-mute tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <span className="flex-1 text-sm font-medium">{exercise.name}</span>
            <span className="text-sm text-soft tabular-nums">{exercise.detail}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          to="/ai-coach"
          className="flex h-11 items-center justify-center rounded-full bg-volt text-sm font-semibold text-ink transition hover:bg-volt-hi"
        >
          AI camera
        </Link>
        <button
          type="button"
          onClick={onManual}
          className="h-11 rounded-full border border-line text-sm font-medium transition hover:border-paper"
        >
          Manual
        </button>
      </div>
    </Card>
  )
}
