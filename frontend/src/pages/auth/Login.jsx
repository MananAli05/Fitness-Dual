import { AnimatePresence, motion } from 'framer-motion'
import { AtSign, Lock, Mail } from 'lucide-react'
import { useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import ConfirmEmailModal from '../../components/auth/ConfirmEmailModal.jsx'
import GoalPicker from '../../components/auth/GoalPicker.jsx'
import Alert from '../../components/common/Alert.jsx'
import PrimaryButton from '../../components/common/PrimaryButton.jsx'
import TextField from '../../components/common/TextField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthLayout from '../../layouts/AuthLayout.jsx'
import { setRememberMe, supabase } from '../../lib/supabase.js'
import { getAuthErrorMessage } from '../../utils/authErrors.js'
import { isValidEmail, isValidUsername } from '../../utils/validation.js'

const MIN_PASSWORD_LENGTH = 8

export default function Login() {
  const { session } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ goal: 'bulk', username: '', email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState(null)
  const usernameRef = useRef(null)

  if (session) return <Navigate to="/home" replace />

  const showError = (error) => setNotice({ type: 'error', text: getAuthErrorMessage(error) })

  const handleChange = (field) => (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

    if (field === 'username') {
      value = value.replace(/[^A-Za-z]/g, '')
    }
    if (field === 'email') {
      setIsSignup(false)
    }

    setForm({ ...form, [field]: value })
    setErrors({ ...errors, [field]: undefined })
    setNotice(null)
  }

  const validate = () => {
    const newErrors = {}

    if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    }
    if (isSignup && !isValidUsername(form.username)) {
      newErrors.username = 'Use 3 to 20 letters (A to Z only)'
    }

    return newErrors
  }

  const logIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (!error) return

    if (!/invalid login credentials/i.test(error.message)) {
      showError(error)
      return
    }

    const { data: isRegistered, error: checkError } = await supabase.rpc('email_registered', { p_email: form.email })

    if (checkError) {
      showError(checkError)
    } else if (isRegistered) {
      showError(error)
    } else {
      setIsSignup(true)
      setNotice({ type: 'success', text: 'New here? Choose a username to create your account.' })
      setTimeout(() => usernameRef.current?.focus(), 50)
    }
  }

  const signUp = async () => {
    const { data: isAvailable, error: checkError } = await supabase.rpc('username_available', {
      p_username: form.username,
    })

    if (checkError) {
      showError(checkError)
      return
    }
    if (!isAvailable) {
      setErrors({ ...errors, username: 'This username is taken. Try another one.' })
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username, goal: form.goal },
        emailRedirectTo: `${window.location.origin}/home`,
      },
    })

    if (error) {
      showError(error)
    } else if (!data.session) {
      setIsSignup(false)
      setConfirmEmail(form.email)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    setNotice(null)
    setRememberMe(form.remember)

    if (isSignup) {
      await signUp()
    } else {
      await logIn()
    }

    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!isValidEmail(form.email)) {
      setErrors({ ...errors, email: 'Enter your email above to reset your password' })
      return
    }

    setNotice(null)
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      showError(error)
    } else {
      setNotice({ type: 'success', text: `If ${form.email} has an account, a reset link is on its way.` })
    }
  }

  return (
    <AuthLayout
      title={isSignup ? 'Create account' : 'Welcome'}
      subtitle={isSignup ? 'One last step. Pick your phase and username.' : 'Log in, or enter a new email to create your account.'}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@gmail.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
        />

        <AnimatePresence initial={false}>
          {isSignup && (
            <motion.div
              key="username"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <p className="mb-2 text-[11px] font-medium tracking-[0.14em] text-mute uppercase">Your phase</p>
                <GoalPicker value={form.goal} onChange={(goal) => setForm({ ...form, goal })} />
              </div>
              <TextField
                ref={usernameRef}
                id="username"
                label="Username"
                icon={AtSign}
                placeholder="e.g. Ali"
                autoComplete="username"
                maxLength={20}
                value={form.username}
                onChange={handleChange('username')}
                error={errors.username}
                hint="Letters only (A to Z), 3 to 20 characters"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-soft select-none">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={handleChange('remember')}
              className="h-4 w-4 rounded accent-teal"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="font-medium text-teal underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {notice && <Alert type={notice.type}>{notice.text}</Alert>}

        <PrimaryButton loading={loading}>{isSignup ? 'Create account' : 'Continue'}</PrimaryButton>
      </form>

      <ConfirmEmailModal email={confirmEmail} onClose={() => setConfirmEmail(null)} />
    </AuthLayout>
  )
}
