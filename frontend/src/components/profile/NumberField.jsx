import { NUMBER_FIELDS } from '../../constants/profile.js'

export default function NumberField({ id, value, onChange, error }) {
  const field = NUMBER_FIELDS[id]

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] font-medium tracking-[0.14em] text-mute uppercase">
        {field.label}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border px-4 transition ${
          error ? 'border-danger/70' : 'border-line hover:border-white/25 focus-within:border-teal'
        }`}
      >
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full [appearance:textfield] bg-transparent text-base text-paper tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-sm text-mute">{field.unit}</span>
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
}
