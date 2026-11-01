import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from '../pages/auth/Login.jsx'
import ResetPassword from '../pages/auth/ResetPassword.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Onboarding from '../pages/Onboarding.jsx'
import Profile from '../pages/Profile.jsx'
import Splash from '../pages/Splash.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute skipOnboardingCheck>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
