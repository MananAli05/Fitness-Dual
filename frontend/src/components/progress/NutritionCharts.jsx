import { formatDay } from '../../utils/dates.js'
import { getDailyCalories, getDailyWater } from '../../utils/nutrition.js'
import ChartCard from './ChartCard.jsx'

export default function NutritionCharts({ dateKeys, foodLogs, waterLogs, targets }) {
  const toChartData = (values) =>
    dateKeys.map((dateKey, index) => ({
      key: dateKey,
      label: formatDay(dateKey).split(',')[0],
      tooltip: formatDay(dateKey),
      value: values[index],
    }))

  const calories = getDailyCalories(foodLogs, dateKeys)
  const water = getDailyWater(waterLogs, dateKeys)
  const loggedDays = calories.filter((value) => value > 0)
  const averageCalories = loggedDays.length
    ? Math.round(loggedDays.reduce((total, value) => total + value, 0) / loggedDays.length)
    : 0
  const waterGoalDays = water.filter((value) => targets && value >= targets.water).length

  return (
    <>
      <ChartCard
        title="Calories per day"
        headline={`${averageCalories.toLocaleString()} kcal`}
        caption={`Average on ${loggedDays.length} logged days this week`}
        data={toChartData(calories)}
        target={targets?.calories}
        unit="kcal"
        delay={0.16}
      />
      <ChartCard
        title="Water per day"
        headline={`${waterGoalDays} / ${dateKeys.length} days`}
        caption="Water goal reached this week"
        data={toChartData(water)}
        target={targets?.water}
        unit="glasses"
        delay={0.2}
      />
    </>
  )
}
