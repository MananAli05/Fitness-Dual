import { Dumbbell, Flame } from 'lucide-react'

const GOALS = [
  { id: 'bulk', label: 'Build muscle', hint: '01 — Bulk', icon: Dumbbell },
  { id: 'cut', label: 'Lose fat', hint: '02 — Cut', icon: Flame },
]

export default function GoalPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Your goal">
      {GOALS.map(({ id, label, hint, icon: Icon }) => {
        const selected = value === id

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(id)}
            className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition ${
              selected ? 'border-volt bg-volt text-ink' : 'border-line text-paper hover:border-white/30'
            }`}
          >
            <span>
              <span className="block text-sm font-semibold">{label}</span>
              <span
                className={`mt-0.5 block text-[11px] tracking-[0.1em] uppercase ${
                  selected ? 'text-ink/60' : 'text-mute'
                }`}
              >
                {hint}
              </span>
            </span>
            <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />
          </button>
        )
      })}
    </div>
  )
}
