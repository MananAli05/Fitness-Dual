import Card from '../common/Card.jsx'
import BarChart from './BarChart.jsx'

export default function ChartCard({ title, headline, caption, data, target, unit, delay }) {
  const isEmpty = data.every((item) => item.value === 0)

  return (
    <Card title={title} delay={delay}>
      <p className="text-3xl font-semibold tracking-tight tabular-nums">{headline}</p>
      <p className="mt-0.5 text-xs text-mute">{caption}</p>

      <div className="mt-8">
        {isEmpty ? (
          <p className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-line text-sm text-mute">
            No data yet
          </p>
        ) : (
          <BarChart data={data} target={target} unit={unit} label={title} />
        )}
      </div>
    </Card>
  )
}
