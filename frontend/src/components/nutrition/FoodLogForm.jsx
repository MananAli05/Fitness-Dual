import { useState } from 'react'
import { FOOD_FIELDS, MEAL_TYPES } from '../../constants/nutrition.js'
import Alert from '../common/Alert.jsx'
import Card from '../common/Card.jsx'
import ChoiceGrid from '../common/ChoiceGrid.jsx'
import PrimaryButton from '../common/PrimaryButton.jsx'
import TextField from '../common/TextField.jsx'

const EMPTY_FORM = { meal: 'breakfast', name: '', calories: '', protein_g: '', carbs_g: '', fat_g: '' }

function validate(form) {
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

export default function FoodLogForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (field) => (value) => {
    setForm({ ...form, [field]: value })
    setErrors({ ...errors, [field]: undefined })
    setSaveError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setSaving(true)
    const { error } = await onAdd({
      meal: form.meal,
      name: form.name.trim(),
      calories: Math.round(Number(form.calories)),
      protein_g: Number(form.protein_g || 0),
      carbs_g: Number(form.carbs_g || 0),
      fat_g: Number(form.fat_g || 0),
    })
    setSaving(false)

    if (error) {
      setSaveError(error)
    } else {
      setForm({ ...EMPTY_FORM, meal: form.meal })
    }
  }

  return (
    <Card title="Log food">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <ChoiceGrid options={MEAL_TYPES} value={form.meal} onChange={handleChange('meal')} columns={2} label="Meal" />

        <TextField
          id="food-name"
          label="Food"
          placeholder="e.g. Chicken karahi with roti"
          maxLength={80}
          value={form.name}
          onChange={(e) => handleChange('name')(e.target.value)}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries(FOOD_FIELDS).map(([field, config]) => (
            <TextField
              key={field}
              id={`food-${field}`}
              label={`${config.label} (${config.unit})`}
              type="number"
              inputMode="decimal"
              min={0}
              max={config.max}
              step={config.step}
              placeholder="0"
              value={form[field]}
              onChange={(e) => handleChange(field)(e.target.value)}
              error={errors[field]}
            />
          ))}
        </div>

        {saveError && <Alert>{saveError}</Alert>}

        <PrimaryButton loading={saving}>Add food</PrimaryButton>
      </form>
    </Card>
  )
}
