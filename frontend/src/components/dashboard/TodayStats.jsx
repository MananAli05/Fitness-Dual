import { DEFAULT_WATER_TARGET } from '../../constants/nutrition.js'
import StatCard from './StatCard.jsx'

export default function TodayStats({ totals, glasses, streak, targets }) {
  const stats = [
    targets && { label: 'Calories', value: totals.calories, target: targets.calories, unit: 'kcal today' },
    targets && { label: 'Protein', value: Math.round(totals.protein), target: targets.protein, unit: 'grams today' },
    { label: 'Water', value: glasses, target: targets?.water ?? DEFAULT_WATER_TARGET, unit: 'glasses today' },
    { label: 'Streak', value: streak, unit: 'days in a row' },
  ].filter(Boolean)

  return (
    <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={0.12 + index * 0.04} />
      ))}
    </div>
  )
}
