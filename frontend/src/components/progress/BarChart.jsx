export default function BarChart({ data, target, unit, label }) {
  const maxValue = Math.max(target ?? 0, ...data.map((item) => item.value), 1) * 1.15
  const toPercent = (value) => `${(value / maxValue) * 100}%`

  return (
    <figure>
      <div className="relative h-48">
        {target > 0 && (
          <div
            className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-soft/60"
            style={{ bottom: toPercent(target) }}
          >
            <span className="absolute right-0 -translate-y-full pb-1 text-[11px] text-soft tabular-nums">
              Target {target.toLocaleString()}
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-end gap-0.5 border-b border-line">
          {data.map((item) => (
            <div
              key={item.key ?? item.label}
              tabIndex={0}
              aria-label={`${item.tooltip ?? item.label}: ${item.value.toLocaleString()} ${unit}`}
              className="group relative flex h-full flex-1 items-end justify-center outline-none"
            >
              <div
                className="w-full max-w-6 rounded-t-[4px] bg-volt transition-opacity group-hover:opacity-80 group-focus:opacity-80"
                style={{ height: item.value > 0 ? toPercent(item.value) : 0 }}
              />
              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 rounded-lg border border-line bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap group-hover:block group-focus:block">
                <span className="text-mute">{item.tooltip ?? item.label}</span>
                <span className="ml-2 font-semibold text-paper tabular-nums">
                  {item.value.toLocaleString()} {unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex gap-0.5" aria-hidden="true">
        {data.map((item) => (
          <span key={item.key ?? item.label} className="flex-1 truncate text-center text-[10px] text-mute sm:text-[11px]">
            {item.label}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {data.map((item) => (
            <tr key={item.key ?? item.label}>
              <th scope="row">{item.tooltip ?? item.label}</th>
              <td>
                {item.value} {unit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
