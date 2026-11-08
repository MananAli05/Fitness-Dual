import { Check } from 'lucide-react'
import PoseFigure from './PoseFigure.jsx'

export default function AiExerciseCard({ exercise, target, checks, poses, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex flex-col overflow-hidden rounded-3xl border bg-charcoal text-left transition ${
        selected ? 'border-volt ring-2 ring-volt/30' : 'border-white/6 hover:border-white/20'
      }`}
    >
      <div className="relative h-52 bg-ink/60 px-4 pt-9 pb-3">
        <PoseFigure poses={poses} label={`${exercise.name} movement`} />
        <span className="absolute top-3 left-3 rounded-full bg-volt/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-volt uppercase">
          AI tracked
        </span>
        {selected && (
          <span className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-volt text-ink">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-lg font-semibold tracking-tight">{exercise.name}</p>
          <span className="shrink-0 font-semibold text-volt tabular-nums">{target}</span>
        </div>
        <p className="mt-1 text-sm text-mute">{exercise.muscles.join(', ')}</p>
        <p className="mt-4 border-t border-line pt-3 text-sm text-soft">
          <span className="font-medium text-paper">AI checks: </span>
          {checks}
        </p>
      </div>
    </button>
  )
}
