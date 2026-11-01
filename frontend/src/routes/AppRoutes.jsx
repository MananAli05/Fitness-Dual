import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Login from '../pages/auth/Login.jsx'
import ResetPassword from '../pages/auth/ResetPassword.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import ExerciseDetail from '../pages/ExerciseDetail.jsx'
import History from '../pages/History.jsx'
import Nutrition from '../pages/Nutrition.jsx'
import Onboarding from '../pages/Onboarding.jsx'
import Profile from '../pages/Profile.jsx'
import Progress from '../pages/Progress.jsx'
import Splash from '../pages/Splash.jsx'
import Workouts from '../pages/Workouts.jsx'
import WorkoutSession from '../pages/WorkoutSession.jsx'
import WorkoutSummary from '../pages/WorkoutSummary.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const PROTECTED_PAGES = [
  { path: '/workouts', page: Workouts },
  { path: '/workouts/exercises/:exerciseId', page: ExerciseDetail },
  { path: '/workouts/session', page: WorkoutSession },
  { path: '/progress', page: Progress },
  { path: '/progress/history', page: History },
  { path: '/progress/history/:workoutId', page: WorkoutSummary },
  { path: '/nutrition', page: Nutrition },
]

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
        {PROTECTED_PAGES.map(({ path, page: Page }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Page />
              </ProtectedRoute>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
