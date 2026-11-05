import SessionTimer from './SessionTimer.jsx'

export default function SessionMobileBar({ workout, saving, onFinish }) {
  const allSets = workout.exercises.flatMap((entry) => entry.sets)
  const doneCount = allSets.filter((set) => set.done).length

  return (
    <div className="flex items-center gap-4 border-t border-white/8 bg-ink/95 px-4 py-3 backdrop-blur">
      <div className="min-w-0 flex-1">
        <p className="text-xl leading-none font-semibold tracking-tight">
          <SessionTimer startedAt={workout.startedAt} />
        </p>
        <p className="mt-1 text-xs text-mute tabular-nums">
          {doneCount} / {allSets.length} sets done
        </p>
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={onFinish}
        className="h-11 shrink-0 rounded-full bg-volt px-6 text-sm font-semibold text-ink transition hover:bg-volt-hi disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Finish'}
      </button>
    </div>
  )
}
