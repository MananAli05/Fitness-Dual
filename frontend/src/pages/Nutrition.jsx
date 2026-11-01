import { useEffect, useState } from 'react'
import Alert from '../components/common/Alert.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import StatCard from '../components/dashboard/StatCard.jsx'
import FoodLogForm from '../components/nutrition/FoodLogForm.jsx'
import FoodLogList from '../components/nutrition/FoodLogList.jsx'
import MealPlanCard from '../components/nutrition/MealPlanCard.jsx'
import WaterTracker from '../components/nutrition/WaterTracker.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { addFoodLog, deleteFoodLog, fetchFoodLogs, fetchWaterLogs, saveWaterGlasses } from '../lib/nutrition.js'
import { formatDay, toDateKey } from '../utils/dates.js'
import { sumMacros } from '../utils/nutrition.js'

const DEFAULT_WATER_TARGET = 8

export default function Nutrition() {
  const { user } = useAuth()
  const { goal, targets } = useProfile()
  const [today] = useState(() => toDateKey())
  const [foodLogs, setFoodLogs] = useState(null)
  const [glasses, setGlasses] = useState(0)
  const [savingWater, setSavingWater] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchFoodLogs(today), fetchWaterLogs(today)]).then(([food, water]) => {
      if (cancelled) return
      setFoodLogs(food.data)
      setGlasses(water.data[0]?.glasses ?? 0)
      setError(food.error ?? water.error)
    })

    return () => {
      cancelled = true
    }
  }, [today])

  const totals = sumMacros(foodLogs ?? [])
  const macros = targets
    ? [
        { label: 'Calories', value: totals.calories, target: targets.calories, unit: 'kcal today' },
        { label: 'Protein', value: Math.round(totals.protein), target: targets.protein, unit: 'grams today' },
        { label: 'Carbs', value: Math.round(totals.carbs), target: targets.carbs, unit: 'grams today' },
        { label: 'Fat', value: Math.round(totals.fat), target: targets.fat, unit: 'grams today' },
      ]
    : []

  const handleAddFood = async (entry) => {
    const { data, error: addError } = await addFoodLog(user.id, { ...entry, log_date: today })
    if (!addError) setFoodLogs((current) => [...(current ?? []), data])
    return { error: addError }
  }

  const handleLogPlanMeal = async (meal) => {
    setError(null)
    const { error: addError } = await handleAddFood(meal)
    if (addError) setError(addError)
  }

  const handleRemoveFood = async (id) => {
    setError(null)
    const { error: removeError } = await deleteFoodLog(id)

    if (removeError) {
      setError(removeError)
    } else {
      setFoodLogs((current) => current.filter((log) => log.id !== id))
    }
  }

  const handleWaterChange = async (newGlasses) => {
    const previousGlasses = glasses
    setGlasses(newGlasses)
    setSavingWater(true)
    setError(null)

    const { error: saveError } = await saveWaterGlasses(user.id, today, newGlasses)
    setSavingWater(false)

    if (saveError) {
      setGlasses(previousGlasses)
      setError(saveError)
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader eyebrow={formatDay(today)} title="Nutrition" />

        {error && (
          <div className="mt-6">
            <Alert>{error}</Alert>
          </div>
        )}

        {macros.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {macros.map((macro, index) => (
              <StatCard key={macro.label} {...macro} delay={index * 0.04} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-mute">Complete your profile to see daily calorie and macro targets.</p>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
          <div className="space-y-4 lg:col-span-7">
            <FoodLogForm onAdd={handleAddFood} />
            {foodLogs ? (
              <FoodLogList logs={foodLogs} onRemove={handleRemoveFood} />
            ) : (
              <p className="text-sm text-mute">Loading food log…</p>
            )}
          </div>

          <div className="space-y-4 lg:col-span-5">
            <WaterTracker
              glasses={glasses}
              target={targets?.water ?? DEFAULT_WATER_TARGET}
              onChange={handleWaterChange}
              saving={savingWater || !foodLogs}
            />
            <MealPlanCard goal={goal} onLog={handleLogPlanMeal} />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
