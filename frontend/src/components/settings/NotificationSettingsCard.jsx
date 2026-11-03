import { useEffect, useState } from 'react'
import { NOTIFICATION_SETTINGS } from '../../constants/settings.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchSettings, saveSettings } from '../../lib/settings.js'
import Alert from '../common/Alert.jsx'
import Card from '../common/Card.jsx'
import ToggleRow from './ToggleRow.jsx'

export default function NotificationSettingsCard() {
  const { user } = useAuth()
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchSettings(user.id).then(({ data, error: fetchError }) => {
      if (cancelled) return
      setSettings(data)
      setError(fetchError)
    })

    return () => {
      cancelled = true
    }
  }, [user.id])

  const handleToggle = (key) => async (checked) => {
    const previousSettings = settings
    const newSettings = { ...settings, [key]: checked }
    setSettings(newSettings)
    setSaving(true)
    setError(null)

    const { error: saveError } = await saveSettings(user.id, newSettings)
    setSaving(false)

    if (saveError) {
      setSettings(previousSettings)
      setError(saveError)
    }
  }

  return (
    <Card title="Notifications" delay={0.04}>
      {settings ? (
        <div className="-my-4 divide-y divide-line">
          {NOTIFICATION_SETTINGS.map((setting) => (
            <ToggleRow
              key={setting.key}
              id={`setting-${setting.key}`}
              label={setting.label}
              hint={setting.hint}
              checked={settings[setting.key]}
              disabled={saving}
              onChange={handleToggle(setting.key)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-mute">Loading settings…</p>
      )}

      {error && (
        <div className="mt-6">
          <Alert>{error}</Alert>
        </div>
      )}
    </Card>
  )
}
