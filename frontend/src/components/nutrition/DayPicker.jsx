import { ChevronLeft, ChevronRight } from 'lucide-react'

function NavButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-paper disabled:opacity-30"
    >
      {children}
    </button>
  )
}

export default function DayPicker({ label, onPrevious, onNext, canGoNext }) {
  return (
    <div className="flex items-center gap-3">
      <NavButton label="Previous day" onClick={onPrevious}>
        <ChevronLeft className="h-5 w-5" />
      </NavButton>
      <span className="min-w-28 text-center font-semibold">{label}</span>
      <NavButton label="Next day" onClick={onNext} disabled={!canGoNext}>
        <ChevronRight className="h-5 w-5" />
      </NavButton>
    </div>
  )
}
