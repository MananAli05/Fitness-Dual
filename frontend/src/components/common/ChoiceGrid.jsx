const COLUMN_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
}

export default function ChoiceGrid({ options, value, onChange, columns = 1, large = false, label }) {
  return (
    <div className={`grid gap-3 ${COLUMN_CLASSES[columns]}`} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const selected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-xl border text-left transition ${large ? 'p-5' : 'p-3.5'} ${
              selected ? 'border-volt bg-volt text-ink' : 'border-line text-paper hover:border-white/30'
            }`}
          >
            <span className={`block font-semibold ${large ? 'text-base' : 'text-sm'}`}>{option.label}</span>
            {option.hint && (
              <span className={`mt-0.5 block text-xs ${selected ? 'text-ink/60' : 'text-mute'}`}>{option.hint}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
