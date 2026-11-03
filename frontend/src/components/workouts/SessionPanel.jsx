import Alert from '../common/Alert.jsx'
import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'
import StatTile from '../common/StatTile.jsx'
import SessionTimer from './SessionTimer.jsx'

export default function SessionPanel({ workout, saving, error, onFinish, onDiscard }) {
  const allSets = workout.exercises.flatMap((entry) => entry.sets)
  const doneSets = allSets.filter((set) => set.done)
  const volume = doneSets.reduce((total, set) => total + Number(set.reps || 0) * Number(set.weight || 0), 0)

  const stats = [
    { label: 'Sets done', value: `${doneSets.length} / ${allSets.length}` },
    { label: 'Volume', value: `${Math.round(volume).toLocaleString()} kg` },
  ]

  return (
    <Card className="lg:sticky lg:top-8">
      <p className="text-[11px] tracking-[0.14em] text-mute uppercase">Time</p>
      <p className="mt-2 text-5xl font-semibold tracking-[-0.04em]">
        <SessionTimer startedAt={workout.startedAt} />
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <StatTile key={stat.label} label={stat.label} value={stat.value} inset />
        ))}
      </div>

      {error && (
        <div className="mt-5">
          <Alert>{error}</Alert>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <PillButton className="w-full" disabled={saving} onClick={onFinish}>
          {saving ? 'Saving…' : 'Finish workout'}
        </PillButton>
        <PillButton variant="danger" className="w-full" disabled={saving} onClick={onDiscard}>
          Discard
        </PillButton>
      </div>
    </Card>
  )
}
