import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'

export default function ProtectedRoute({ children, skipOnboardingCheck = false }) {
  const { session, loading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()

  if (loading || (session && profileLoading)) return null
  if (!session) return <Navigate to="/login" replace />
  if (!skipOnboardingCheck && profile && !profile.onboarded) return <Navigate to="/onboarding" replace />

  return children
}
