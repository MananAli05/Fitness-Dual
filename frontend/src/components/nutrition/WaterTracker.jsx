import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'

const GLASS_ML = 250
const MAX_GLASSES = 40

export default function WaterTracker({ glasses, target, onChange, saving }) {
  const percent = Math.min(100, Math.round((glasses / target) * 100))

  return (
    <Card title="Water">
      <div className="flex items-end justify-between gap-4">
        <p className="text-5xl font-semibold tracking-[-0.04em] tabular-nums">
          {glasses}
          <span className="text-lg font-normal text-mute"> / {target}</span>
        </p>
        <p className="pb-1.5 text-sm text-mute tabular-nums">{percent}%</p>
      </div>
      <p className="mt-1 text-xs text-mute">
        Glasses today ({GLASS_ML} ml each) · {((glasses * GLASS_ML) / 1000).toFixed(2)} L
      </p>

      <div className="mt-5 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: target }, (_, index) => (
          <span key={index} className={`h-2 flex-1 rounded-full ${index < glasses ? 'bg-volt' : 'bg-paper/10'}`} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <PillButton variant="outline" disabled={saving || glasses === 0} onClick={() => onChange(glasses - 1)}>
          Remove glass
        </PillButton>
        <PillButton disabled={saving || glasses >= MAX_GLASSES} onClick={() => onChange(glasses + 1)}>
          Add glass
        </PillButton>
      </div>
    </Card>
  )
}
