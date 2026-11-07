import { MEAL_TYPES } from '../../constants/nutrition.js'
import Card from '../common/Card.jsx'

function formatMacros(log) {
  return `Protein ${Math.round(log.protein_g)} g · Carbs ${Math.round(log.carbs_g)} g · Fat ${Math.round(log.fat_g)} g`
}

export default function FoodLogList({ title, logs, onRemove }) {
  const meals = MEAL_TYPES.map((mealType) => ({
    ...mealType,
    logs: logs.filter((log) => log.meal === mealType.value),
  })).filter((meal) => meal.logs.length > 0)

  return (
    <Card title={title} delay={0.06}>
      {meals.length === 0 && <p className="text-sm text-mute">Nothing logged yet. Search for a food above to add it.</p>}

      <div className="space-y-6">
        {meals.map((meal) => (
          <section key={meal.value}>
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <h3 className="text-sm font-semibold">{meal.label}</h3>
              <span className="text-xs text-mute tabular-nums">
                {meal.logs.reduce((total, log) => total + log.calories, 0).toLocaleString()} kcal
              </span>
            </div>
            <ul className="divide-y divide-line">
              {meal.logs.map((log) => (
                <li key={log.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{log.name}</p>
                    <p className="text-xs text-mute tabular-nums">{formatMacros(log)}</p>
                  </div>
                  <span className="text-sm text-soft tabular-nums">{log.calories} kcal</span>
                  <button
                    type="button"
                    onClick={() => onRemove(log.id)}
                    className="text-xs text-mute transition hover:text-danger"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Card>
  )
}
