import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { WorkoutProvider } from './context/WorkoutContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <WorkoutProvider>
            <AppRoutes />
          </WorkoutProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
