import { GOALS } from '../../constants/profile.js'

export default function PlanSummary({ targets, answers }) {
  const isCut = answers.goal === 'cut'
  const goal = GOALS.find((item) => item.value === answers.goal)

  const details = [
    { label: 'Protein', value: targets.protein, unit: 'g / day' },
    { label: 'Carbs', value: targets.carbs, unit: 'g / day' },
    { label: 'Fat', value: targets.fat, unit: 'g / day' },
    { label: 'Water', value: targets.water, unit: 'glasses / day' },
  ]

  return (
    <div>
      <p className="text-xs tracking-[0.14em] text-mute uppercase">{goal.hint}</p>
      <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
        Your plan is ready.
      </h1>
      <p className="mt-3 text-soft">
        Maintenance is about {targets.maintenance.toLocaleString()} kcal. We {isCut ? 'removed 500' : 'added 300'} kcal
        for your {isCut ? 'cut' : 'bulk'}.
      </p>

      <div className="mt-8 rounded-3xl bg-volt p-6 text-ink">
        <p className="text-xs font-medium tracking-[0.14em] uppercase">Daily calories</p>
        <p className="mt-2 text-6xl font-semibold tracking-[-0.05em] tabular-nums">
          {targets.calories.toLocaleString()}
          <span className="ml-2 text-lg font-medium tracking-normal">kcal</span>
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {details.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/6 bg-charcoal p-4">
            <p className="text-[11px] tracking-[0.14em] text-mute uppercase">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{item.value}</p>
            <p className="text-xs text-mute">{item.unit}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-mute">
        BMI {targets.bmi}. These are estimates. Adjust them with your coach or doctor if needed.
      </p>
    </div>
  )
}
