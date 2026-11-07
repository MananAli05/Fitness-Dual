import { FOOD_FIELDS } from '../../constants/nutrition.js'
import TextField from '../common/TextField.jsx'

export default function ManualFoodFields({ form, errors, onChange, onSearch }) {
  return (
    <div className="space-y-4">
      <TextField
        id="food-name"
        label="Food name"
        placeholder="e.g. Chicken karahi with roti"
        maxLength={80}
        value={form.name}
        onChange={(e) => onChange('name', e.target.value)}
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
            onChange={(e) => onChange(field, e.target.value)}
            error={errors[field]}
          />
        ))}
      </div>

      <button type="button" onClick={onSearch} className="text-sm font-medium text-teal hover:underline">
        Search food list instead
      </button>
    </div>
  )
}
