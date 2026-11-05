import { Link } from 'react-router-dom'
import { formatTarget } from '../../utils/workouts.js'

export default function ExerciseCard({ exercise, goal, level }) {
  return (
    <Link
      to={`/workouts/exercises/${exercise.id}`}
      className="flex h-full flex-col rounded-3xl border border-line bg-charcoal p-5 transition hover:border-volt/60"
    >
      <p className="text-[11px] tracking-[0.14em] text-mute uppercase">
        {exercise.category} · {exercise.level}
      </p>
      <p className="mt-3 text-lg font-semibold tracking-tight">{exercise.name}</p>
      <p className="mt-1 text-sm text-mute">{exercise.muscles.join(', ')}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
        <span className="truncate text-mute">{exercise.equipment}</span>
        <span className="shrink-0 font-medium text-volt tabular-nums">{formatTarget(exercise, goal, level)}</span>
      </div>
    </Link>
  )
}
