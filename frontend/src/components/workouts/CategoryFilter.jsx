export default function CategoryFilter({ categories, value, onChange, label = 'Exercise category' }) {
  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      role="radiogroup"
      aria-label={label}
    >
      {categories.map((category) => {
        const selected = value === category

        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(category)}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm transition ${
              selected ? 'border-volt bg-volt font-semibold text-ink' : 'border-line text-soft hover:border-paper hover:text-paper'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
