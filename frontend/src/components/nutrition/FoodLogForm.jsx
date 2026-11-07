import { useState } from 'react'
import { FOOD_FIELDS, MEAL_TYPES } from '../../constants/nutrition.js'
import { getFoodMacros, getFoodName } from '../../utils/nutrition.js'
import Alert from '../common/Alert.jsx'
import Card from '../common/Card.jsx'
import PrimaryButton from '../common/PrimaryButton.jsx'
import FoodSearch from './FoodSearch.jsx'
import ManualFoodFields from './ManualFoodFields.jsx'
import SelectedFood from './SelectedFood.jsx'

const EMPTY_MANUAL = { name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '' }

function validateManual(form) {
  const errors = {}

  if (!form.name.trim()) errors.name = 'Enter what you ate'

  Object.entries(FOOD_FIELDS).forEach(([field, config]) => {
    const value = form[field]
    if (field !== 'calories' && value === '') return

    const number = Number(value)
    if (value === '' || Number.isNaN(number) || number < 0 || number > config.max) {
      errors[field] = `0 to ${config.max} ${config.unit}`
    }
  })

  return errors
}

function MealPicker({ value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">Which meal?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Meal">
        {MEAL_TYPES.map((meal) => (
          <button
            key={meal.value}
            type="button"
            role="radio"
            aria-checked={value === meal.value}
            onClick={() => onChange(meal.value)}
            className={`h-11 rounded-full border text-sm font-semibold transition ${
              value === meal.value ? 'border-volt bg-volt text-ink' : 'border-line hover:border-white/30'
            }`}
          >
            {meal.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function FoodLogForm({ onAdd }) {
  const [meal, setMeal] = useState('breakfast')
  const [mode, setMode] = useState('search')
  const [selected, setSelected] = useState(null)
  const [manual, setManual] = useState(EMPTY_MANUAL)
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  const mealLabel = MEAL_TYPES.find((item) => item.value === meal).label
  const canSubmit = mode === 'manual' || selected

  const resetForm = () => {
    setSelected(null)
    setManual(EMPTY_MANUAL)
    setErrors({})
  }

  const switchMode = (newMode) => {
    resetForm()
    setSaveError(null)
    setMode(newMode)
  }

  const handleManualChange = (field, value) => {
    setManual({ ...manual, [field]: value })
    setErrors({ ...errors, [field]: undefined })
    setSaveError(null)
  }

  const buildEntry = () => {
    if (mode === 'search') {
      return { meal, name: getFoodName(selected.food, selected.amount), ...getFoodMacros(selected.food, selected.amount) }
    }

    return {
      meal,
      name: manual.name.trim(),
      calories: Math.round(Number(manual.calories)),
      protein_g: Number(manual.protein_g || 0),
      carbs_g: Number(manual.carbs_g || 0),
      fat_g: Number(manual.fat_g || 0),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === 'manual') {
      const newErrors = validateManual(manual)
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) return
    }

    setSaving(true)
    const { error } = await onAdd(buildEntry())
    setSaving(false)

    if (error) {
      setSaveError(error)
    } else {
      resetForm()
    }
  }

  return (
    <Card title="Add food">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <MealPicker value={meal} onChange={setMeal} />

        {mode === 'manual' && (
          <ManualFoodFields form={manual} errors={errors} onChange={handleManualChange} onSearch={() => switchMode('search')} />
        )}

        {mode === 'search' && selected && (
          <SelectedFood
            food={selected.food}
            amount={selected.amount}
            onAmountChange={(amount) => setSelected({ ...selected, amount })}
            onChange={() => setSelected(null)}
          />
        )}

        {mode === 'search' && !selected && (
          <FoodSearch onSelect={(food) => setSelected({ food, amount: 1 })} onManual={() => switchMode('manual')} />
        )}

        {saveError && <Alert>{saveError}</Alert>}

        {canSubmit && <PrimaryButton loading={saving}>Add to {mealLabel}</PrimaryButton>}
      </form>
    </Card>
  )
}
