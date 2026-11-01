export default function StatTile({ label, value, unit, inset = false }) {
  return (
    <div className={`rounded-2xl border border-line p-4 ${inset ? 'bg-ink' : 'bg-charcoal'}`}>
      <p className="text-[11px] tracking-[0.14em] text-mute uppercase">{label}</p>
      <p className="mt-2 text-lg font-semibold tabular-nums">{value}</p>
      {unit && <p className="text-xs text-mute">{unit}</p>}
    </div>
  )
}
