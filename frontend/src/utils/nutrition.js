import { FOODS, findFood } from '../constants/foods.js'
import { ADJUSTABLE_FOODS, MEAL_PLAN_WEEK } from '../constants/nutrition.js'

export function sumMacros(logs) {
  return logs.reduce(
    (total, log) => ({
      calories: total.calories + log.calories,
      protein: total.protein + Number(log.protein_g),
      carbs: total.carbs + Number(log.carbs_g),
      fat: total.fat + Number(log.fat_g),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}

export function getDailyCalories(logs, dateKeys) {
  return dateKeys.map((dateKey) =>
    logs.filter((log) => log.log_date === dateKey).reduce((total, log) => total + log.calories, 0),
  )
}

export function getDailyWater(waterLogs, dateKeys) {
  return dateKeys.map((dateKey) => waterLogs.find((log) => log.log_date === dateKey)?.glasses ?? 0)
}

export function searchFoods(query, limit = 6) {
  const text = query.trim().toLowerCase()
  if (!text) return []

  return FOODS
    .filter((food) => [food.name, ...food.aliases].some((word) => word.toLowerCase().includes(text)))
    .slice(0, limit)
}

export function formatAmount(amount) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(1)
}

export function getFoodName(food, amount) {
  return amount === 1 ? food.name : `${food.name} × ${formatAmount(amount)}`
}

export function getFoodMacros(food, amount) {
  return {
    calories: Math.round(food.calories * amount),
    protein_g: Math.round(food.protein_g * amount * 10) / 10,
    carbs_g: Math.round(food.carbs_g * amount * 10) / 10,
    fat_g: Math.round(food.fat_g * amount * 10) / 10,
  }
}

function roundToHalf(value) {
  return Math.max(0.5, Math.round(value * 2) / 2)
}

function adjustPortions(day, calorieTarget) {
  const items = day.flatMap((meal) => meal.items.map(([foodId, amount]) => ({ meal: meal.meal, food: findFood(foodId), amount })))
  const baseCalories = items.reduce((total, item) => total + item.food.calories * item.amount, 0)
  const adjustable = items.filter((item) => ADJUSTABLE_FOODS.includes(item.food.id))
  const adjustableCalories = adjustable.reduce((total, item) => total + item.food.calories * item.amount, 0)

  if (!calorieTarget || adjustableCalories === 0) return items

  const scale = Math.max(0.5, 1 + (calorieTarget - baseCalories) / adjustableCalories)

  return items.map((item) =>
    ADJUSTABLE_FOODS.includes(item.food.id) ? { ...item, amount: roundToHalf(item.amount * scale) } : item,
  )
}

export function getMealPlan(goal, date, calorieTarget) {
  const week = MEAL_PLAN_WEEK[goal] ?? MEAL_PLAN_WEEK.bulk
  const day = week[date.getDay()]
  const items = adjustPortions(day, calorieTarget)

  const meals = day.map(({ meal }) => {
    const mealItems = items.filter((item) => item.meal === meal)
    const macros = mealItems.map((item) => getFoodMacros(item.food, item.amount))

    return {
      meal,
      name: mealItems.map((item) => getFoodName(item.food, item.amount)).join(', '),
      calories: macros.reduce((total, item) => total + item.calories, 0),
      protein_g: Math.round(macros.reduce((total, item) => total + item.protein_g, 0)),
      carbs_g: Math.round(macros.reduce((total, item) => total + item.carbs_g, 0)),
      fat_g: Math.round(macros.reduce((total, item) => total + item.fat_g, 0)),
    }
  })

  return { meals, calories: meals.reduce((total, meal) => total + meal.calories, 0) }
}
