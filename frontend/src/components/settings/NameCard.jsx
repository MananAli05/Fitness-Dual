import { useState } from 'react'
import { useProfile } from '../../context/ProfileContext.jsx'
import { supabase } from '../../lib/supabase.js'
import Alert from '../common/Alert.jsx'
import PrimaryButton from '../common/PrimaryButton.jsx'
import TextField from '../common/TextField.jsx'
import SettingsSection from './SettingsSection.jsx'

const NAME_PATTERN = /^[A-Za-z]{3,20}$/

export default function NameCard() {
  const { profile, save } = useProfile()
  const [name, setName] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  const current = profile?.username ?? ''
  const value = name ?? current

  const handleChange = (e) => {
    setName(e.target.value.replace(/[^A-Za-z]/g, ''))
    setError('')
    setNotice(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!NAME_PATTERN.test(value)) {
      setError('Use 3 to 20 letters, no numbers or spaces')
      return
    }
    if (value === current) return

    setLoading(true)
    if (value.toLowerCase() !== current.toLowerCase()) {
      const { data: isAvailable } = await supabase.rpc('username_available', { p_username: value })
      if (isAvailable === false) {
        setLoading(false)
        setError('This name is already taken')
        return
      }
    }

    const { error: saveError } = await save({ username: value })
    setLoading(false)

    if (saveError) {
      setNotice({ type: 'error', text: saveError })
      return
    }
    setName(null)
    setNotice({ type: 'success', text: 'Name updated.' })
  }

  return (
    <SettingsSection title="Name" description="This is the name shown on your dashboard." delay={0.02}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="display-name"
          label="Name"
          placeholder="e.g. Ali"
          autoComplete="nickname"
          value={value}
          onChange={handleChange}
          error={error}
        />

        {notice && <Alert type={notice.type}>{notice.text}</Alert>}

        <PrimaryButton loading={loading}>Save name</PrimaryButton>
      </form>
    </SettingsSection>
  )
}
