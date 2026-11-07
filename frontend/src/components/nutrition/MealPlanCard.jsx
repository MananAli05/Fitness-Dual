import { Check } from 'lucide-react'
import { MEAL_TYPES } from '../../constants/nutrition.js'
import { getMealPlan } from '../../utils/nutrition.js'
import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'

function getMealLabel(value) {
  return MEAL_TYPES.find((mealType) => mealType.value === value).label
}

export default function MealPlanCard({ goal, date, calorieTarget, loggedFoods, onLog }) {
  const plan = getMealPlan(goal, date, calorieTarget)

  const isLogged = (meal) => loggedFoods.some((log) => log.meal === meal.meal && log.name === meal.name)

  return (
    <Card title="Meal plan for the day" delay={0.1}>
      <p className="text-xl font-semibold tracking-tight">{plan.calories.toLocaleString()} kcal</p>
      <p className="mt-1 text-sm text-mute">
        {calorieTarget
          ? `Portions are sized for your ${calorieTarget.toLocaleString()} kcal target. Tap Log when you eat a meal.`
          : 'Tap Log when you eat a meal.'}
      </p>

      <ul className="mt-5 divide-y divide-line">
        {plan.meals.map((meal, index) => {
          const logged = isLogged(meal)

          return (
            <li key={`${meal.meal}-${index}`} className="flex items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] tracking-[0.14em] text-mute uppercase">{getMealLabel(meal.meal)}</p>
                <p className="mt-0.5 font-medium">{meal.name}</p>
                <p className="mt-0.5 text-sm text-soft tabular-nums">
                  {meal.calories} kcal · Protein {meal.protein_g} g
                </p>
              </div>
              {logged ? (
                <span className="flex h-10 items-center gap-1.5 rounded-full bg-teal/10 px-4 text-sm font-medium text-teal">
                  <Check className="h-4 w-4" strokeWidth={2.5} /> Logged
                </span>
              ) : (
                <PillButton variant="outline" size="small" onClick={() => onLog(meal)}>
                  Log
                </PillButton>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
