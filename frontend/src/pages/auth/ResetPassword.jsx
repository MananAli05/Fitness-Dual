import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../../components/common/Alert.jsx'
import PrimaryButton from '../../components/common/PrimaryButton.jsx'
import TextField from '../../components/common/TextField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import { supabase } from '../../lib/supabase.js'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setErrors({ ...errors, [field]: undefined })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (form.password.length < 8) {
      newErrors.password = 'Use at least 8 characters'
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

    setNotice({ type: 'success', text: 'Password updated. Taking you in…' })
    setTimeout(() => navigate('/home', { replace: true }), 1200)
  }

  if (!authLoading && !session) {
    return (
      <AuthLayout title="Link expired" subtitle="This reset link is invalid or has expired.">
        <Link to="/login" className="text-paper underline underline-offset-4">
          Back to log in
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="New password" subtitle="Choose a strong password for your account.">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="password"
          label="New password"
          type="password"
          icon={Lock}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
        />
        <TextField
          id="confirm"
          label="Confirm password"
          type="password"
          icon={Lock}
          placeholder="Re-enter password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange('confirm')}
          error={errors.confirm}
        />

        {notice && <Alert type={notice.type}>{notice.text}</Alert>}

        <PrimaryButton loading={loading}>Update password</PrimaryButton>
      </form>
    </AuthLayout>
  )
}
