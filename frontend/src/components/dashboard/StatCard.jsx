import Card from '../common/Card.jsx'
import Meter from './Meter.jsx'

function StreakDots({ days }) {
  return (
    <div className="flex gap-1.5" aria-label={`${days} of 7 days`}>
      {Array.from({ length: 7 }, (_, index) => (
        <span key={index} className={`h-1.5 flex-1 rounded-full ${index < days ? 'bg-volt' : 'bg-white/8'}`} />
      ))}
    </div>
  )
}

export default function StatCard({ label, value, target, unit, delay }) {
  return (
    <Card delay={delay} className="!p-5">
      <span className="text-[11px] tracking-[0.14em] text-mute uppercase">{label}</span>
      <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
        {value.toLocaleString()}
        {target && <span className="text-base font-normal text-mute"> / {target.toLocaleString()}</span>}
      </p>
      <p className="mt-0.5 text-xs text-mute">{unit}</p>
      <div className="mt-4">{target ? <Meter value={value} target={target} /> : <StreakDots days={value} />}</div>
    </Card>
  )
}
