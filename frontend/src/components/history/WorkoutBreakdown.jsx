import { Link } from 'react-router-dom'
import { findExercise } from '../../constants/exercises.js'
import { formatSet, groupSetsByExercise } from '../../utils/workouts.js'
import Card from '../common/Card.jsx'

export default function WorkoutBreakdown({ sets }) {
  const groups = groupSetsByExercise(sets)

  return (
    <Card title="Exercises" delay={0.06}>
      <ul className="divide-y divide-line">
        {groups.map((group, index) => (
          <li key={group.position} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:gap-6">
            <div className="flex w-full gap-3 sm:w-56 sm:shrink-0">
              <span className="w-5 text-xs text-mute tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              {findExercise(group.exerciseId) ? (
                <Link to={`/workouts/exercises/${group.exerciseId}`} className="text-sm font-medium hover:text-volt">
                  {group.name}
                </Link>
              ) : (
                <span className="text-sm font-medium">{group.name}</span>
              )}
            </div>
            <ol className="flex flex-wrap gap-2 pl-8 sm:pl-0">
              {group.sets.map((set) => (
                <li
                  key={set.set_number}
                  className="rounded-full border border-line px-3 py-1 text-xs text-soft tabular-nums"
                >
                  {formatSet(set)}
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </Card>
  )
}
