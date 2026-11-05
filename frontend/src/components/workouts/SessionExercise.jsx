import { Link } from 'react-router-dom'
import { findExercise } from '../../constants/exercises.js'
import Card from '../common/Card.jsx'

function SetInput({ label, value, onChange, step = 1 }) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min={0}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-10 w-full min-w-0 [appearance:textfield] rounded-lg border border-line bg-ink px-3 text-center text-base text-paper tabular-nums outline-none focus:border-teal [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  )
}

export default function SessionExercise({ entry, position, onUpdateSet, onAddSet, onRemoveSet, onRemove }) {
  const exercise = findExercise(entry.exerciseId)
  const isTimed = exercise.type === 'time'
  const columns = isTimed ? 'grid-cols-[2rem_1fr_5rem]' : 'grid-cols-[2rem_1fr_1fr_5rem]'

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.14em] text-mute uppercase tabular-nums">
            {String(position + 1).padStart(2, '0')} · {exercise.category}
          </p>
          <Link
            to={`/workouts/exercises/${exercise.id}`}
            className="mt-1 block truncate text-lg font-semibold tracking-tight hover:text-volt"
          >
            {exercise.name}
          </Link>
        </div>
        <button type="button" onClick={onRemove} className="shrink-0 text-sm text-mute transition hover:text-danger">
          Remove
        </button>
      </div>

      <div className="mt-5 space-y-2">
        <div className={`grid ${columns} gap-2 px-1 text-[11px] tracking-[0.14em] text-mute uppercase`}>
          <span>Set</span>
          <span className="text-center">{isTimed ? 'Seconds' : 'Reps'}</span>
          {!isTimed && <span className="text-center">kg</span>}
          <span />
        </div>

        {entry.sets.map((set, index) => {
          const value = isTimed ? set.seconds : set.reps
          const canComplete = Number(value) > 0

          return (
            <div
              key={index}
              className={`grid ${columns} items-center gap-2 rounded-xl p-1 transition ${set.done ? 'bg-volt/10' : ''}`}
            >
              <span className="pl-1 text-sm text-mute tabular-nums">{index + 1}</span>
              <SetInput
                label={`Set ${index + 1} ${isTimed ? 'seconds' : 'reps'}`}
                value={value}
                onChange={(newValue) => onUpdateSet(index, { [isTimed ? 'seconds' : 'reps']: newValue })}
              />
              {!isTimed && (
                <SetInput
                  label={`Set ${index + 1} weight in kg`}
                  value={set.weight}
                  step={0.5}
                  onChange={(newValue) => onUpdateSet(index, { weight: newValue })}
                />
              )}
              <button
                type="button"
                disabled={!canComplete}
                aria-pressed={set.done}
                onClick={() => onUpdateSet(index, { done: !set.done })}
                className={`h-10 rounded-full text-sm font-semibold transition disabled:opacity-40 ${
                  set.done ? 'bg-volt text-ink' : 'border border-line text-paper hover:border-paper'
                }`}
              >
                {set.done ? 'Done' : 'Log'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <button type="button" onClick={onAddSet} className="font-medium text-teal underline-offset-4 hover:underline">
          Add set
        </button>
        {entry.sets.length > 1 && (
          <button
            type="button"
            onClick={() => onRemoveSet(entry.sets.length - 1)}
            className="text-mute transition hover:text-paper"
          >
            Remove last set
          </button>
        )}
      </div>
      {!isTimed && <p className="mt-3 text-xs text-mute">Leave kg empty for bodyweight sets.</p>}
    </Card>
  )
}
