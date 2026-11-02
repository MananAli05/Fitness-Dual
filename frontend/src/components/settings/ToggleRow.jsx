export default function ToggleRow({ id, label, hint, checked, disabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="block text-sm font-semibold">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-mute">{hint}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'border-volt bg-volt' : 'border-line bg-ink'
        }`}
      >
        <span
          className={`absolute top-1/2 left-1 h-5 w-5 -translate-y-1/2 rounded-full transition-transform ${
            checked ? 'translate-x-5 bg-ink' : 'bg-mute'
          }`}
        />
      </button>
    </div>
  )
}
