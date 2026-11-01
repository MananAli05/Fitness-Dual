export default function Meter({ value, target }) {
  const percent = Math.min(100, (value / target) * 100)

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <div className="h-full rounded-full bg-volt" style={{ width: `${percent}%` }} />
    </div>
  )
}
