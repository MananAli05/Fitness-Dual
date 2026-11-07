import { Minus, Plus } from 'lucide-react'
import { formatAmount, getFoodMacros } from '../../utils/nutrition.js'

const MIN_AMOUNT = 0.5
const MAX_AMOUNT = 20

function getLess(amount) {
  return amount <= 1 ? MIN_AMOUNT : amount - 1
}

function getMore(amount) {
  return amount < 1 ? 1 : amount + 1
}

function StepButton({ label, onClick, disabled, children }) {
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

export default function SelectedFood({ food, amount, onAmountChange, onChange }) {
  const macros = getFoodMacros(food, amount)

  return (
    <div className="rounded-2xl border border-line p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-semibold">{food.name}</p>
          <p className="text-sm text-mute">
            1 {food.portion} = {food.calories} kcal
          </p>
        </div>
        <button type="button" onClick={onChange} className="text-sm font-medium text-teal hover:underline">
          Change
        </button>
      </div>

      <p className="mt-5 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">How much?</p>
      <div className="mt-2 flex items-center gap-4">
        <StepButton
          label="Less"
          onClick={() => onAmountChange(getLess(amount))}
          disabled={amount <= MIN_AMOUNT}
        >
          <Minus className="h-4 w-4" />
        </StepButton>
        <p className="min-w-24 text-center">
          <span className="text-3xl font-semibold tabular-nums">{formatAmount(amount)}</span>
          <span className="ml-1.5 text-sm text-mute">{food.portion}</span>
        </p>
        <StepButton
          label="More"
          onClick={() => onAmountChange(getMore(amount))}
          disabled={amount >= MAX_AMOUNT}
        >
          <Plus className="h-4 w-4" />
        </StepButton>
      </div>

      <div className="mt-5 rounded-xl bg-white/5 px-4 py-3">
        <p className="text-2xl font-semibold tabular-nums">{macros.calories} kcal</p>
        <p className="mt-1 text-sm text-soft tabular-nums">
          Protein {Math.round(macros.protein_g)} g · Carbs {Math.round(macros.carbs_g)} g · Fat {Math.round(macros.fat_g)} g
        </p>
      </div>
    </div>
  )
}
