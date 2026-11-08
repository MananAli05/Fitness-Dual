import { Check, ScanLine } from 'lucide-react'

export default function AiExerciseCard({ exercise, image, target, checks, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex flex-col overflow-hidden rounded-3xl border bg-charcoal text-left transition ${
        selected ? 'border-volt ring-2 ring-volt/30' : 'border-white/6 hover:border-white/20'
      }`}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-ink">
        <img
          src={image}
          alt={`${exercise.name} with AI body tracking`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-volt uppercase backdrop-blur">
          <ScanLine className="h-3.5 w-3.5" strokeWidth={2} />
          AI tracked
        </span>
        {selected && (
          <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-volt text-ink">
            <Check className="h-4.5 w-4.5" strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xl font-semibold tracking-tight">{exercise.name}</p>
          <span className="shrink-0 text-lg font-semibold text-volt tabular-nums">{target}</span>
        </div>
        <p className="mt-1 text-sm text-mute">{exercise.muscles.join(', ')}</p>
        <p className="mt-4 text-sm leading-relaxed text-soft">{checks}</p>
      </div>
    </button>
  )
}
