import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import Alert from '../common/Alert.jsx'
import Card from '../common/Card.jsx'
import PrimaryButton from '../common/PrimaryButton.jsx'
import TextField from '../common/TextField.jsx'

const MIN_PASSWORD_LENGTH = 8
const EMPTY_FORM = { password: '', confirm: '' }

export default function PasswordCard() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setErrors({ ...errors, [field]: undefined })
    setNotice(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`
    }
    if (form.confirm !== form.password) {
      newErrors.confirm = 'Passwords do not match'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: form.password })
    setLoading(false)

    if (error) {
      setNotice({ type: 'error', text: error.message })
      return
    }

    setForm(EMPTY_FORM)
    setNotice({ type: 'success', text: 'Password updated.' })
  }

  return (
    <Card title="Change password" delay={0.08}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="new-password"
          label="New password"
          type="password"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
        />
        <TextField
          id="confirm-password"
          label="Confirm password"
          type="password"
          placeholder="Re-enter password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange('confirm')}
          error={errors.confirm}
        />

        {notice && <Alert type={notice.type}>{notice.text}</Alert>}

        <PrimaryButton loading={loading}>Update password</PrimaryButton>
      </form>
    </Card>
  )
}
