import { Link } from 'react-router-dom'
import { formatDay, formatDuration, formatTime } from '../../utils/dates.js'
import { groupSetsByExercise, summarizeSets } from '../../utils/workouts.js'

export default function WorkoutListItem({ workout }) {
  const summary = summarizeSets(workout.workout_sets)
  const exerciseNames = groupSetsByExercise(workout.workout_sets).map((group) => group.name)

  return (
    <li>
      <Link
        to={`/progress/history/${workout.id}`}
        className="flex flex-col gap-3 py-4 transition hover:text-volt sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="w-32 shrink-0">
          <p className="text-sm font-medium">{formatDay(workout.started_at)}</p>
          <p className="text-xs text-mute">{formatTime(workout.started_at)}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{workout.title}</p>
          <p className="truncate text-sm text-mute">{exerciseNames.join(', ')}</p>
        </div>
        <div className="flex gap-5 text-sm text-soft tabular-nums">
          <span>{formatDuration(workout.duration_seconds)}</span>
          <span>{summary.sets} sets</span>
          {summary.volume > 0 && <span>{Math.round(summary.volume).toLocaleString()} kg</span>}
        </div>
      </Link>
    </li>
  )
}
