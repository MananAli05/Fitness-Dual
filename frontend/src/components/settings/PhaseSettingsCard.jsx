import { useState } from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { formatDay } from '../../utils/dates.js'
import { getPhaseProgress } from '../../utils/phase.js'
import Alert from '../common/Alert.jsx'
import Card from '../common/Card.jsx'
import PillButton from '../common/PillButton.jsx'
import StatTile from '../common/StatTile.jsx'

export default function PhaseSettingsCard() {
  const { profile, goal, save } = useProfile()
  const [notice, setNotice] = useState(null)
  const [saving, setSaving] = useState(false)

  const phase = getPhaseProgress(goal, profile?.phase_started_at)

  const handleRestart = async () => {
    if (!window.confirm(`Restart your ${phase.name} phase from week 1?`)) return

    setSaving(true)
    const { error } = await save({ phase_started_at: new Date().toISOString() })
    setSaving(false)

    setNotice(error ? { type: 'error', text: error } : { type: 'success', text: 'Phase restarted from week 1.' })
  }

  return (
    <Card title="Phase" delay={0.12}>
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Current phase" value={phase.name} unit={`${phase.totalWeeks} weeks`} inset />
        <StatTile
          label="Progress"
          value={phase.complete ? 'Complete' : `Week ${phase.week}`}
          unit={`Started ${formatDay(phase.startedAt)}`}
          inset
        />
      </div>

      <p className="mt-4 text-sm text-mute">
        Switching between Bulk and Cut on your profile starts the new phase from week 1.
      </p>

      {notice && (
        <div className="mt-4">
          <Alert type={notice.type}>{notice.text}</Alert>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <PillButton variant="outline" to="/profile">
          Change phase
        </PillButton>
        <PillButton variant="danger" disabled={saving} onClick={handleRestart}>
          {saving ? 'Restarting…' : 'Restart phase'}
        </PillButton>
      </div>
    </Card>
  )
}
