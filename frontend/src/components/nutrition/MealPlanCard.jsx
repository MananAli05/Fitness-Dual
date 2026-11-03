import { MEAL_PLANS, MEAL_TYPES } from '../../constants/nutrition.js'
import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'

export default function MealPlanCard({ goal, onLog }) {
  const plan = MEAL_PLANS[goal] ?? MEAL_PLANS.bulk
  const totalCalories = plan.meals.reduce((total, meal) => total + meal.calories, 0)

  return (
    <Card title="Meal plan" delay={0.1}>
      <p className="text-xl font-semibold tracking-tight">{plan.title}</p>
      <p className="mt-1 text-sm text-mute">
        About {totalCalories.toLocaleString()} kcal. Adjust portions to match your daily target.
      </p>

      <ul className="mt-5 divide-y divide-line">
        {plan.meals.map((meal) => (
          <li key={meal.name} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] tracking-[0.14em] text-mute uppercase">
                {MEAL_TYPES.find((mealType) => mealType.value === meal.meal).label}
              </p>
              <p className="text-sm font-medium">{meal.name}</p>
              <p className="text-xs text-mute tabular-nums">
                {meal.calories} kcal · P {meal.protein_g} g · C {meal.carbs_g} g · F {meal.fat_g} g
              </p>
            </div>
            <PillButton variant="outline" size="small" onClick={() => onLog(meal)}>
              Log
            </PillButton>
          </li>
        ))}
      </ul>
    </Card>
  )
}
