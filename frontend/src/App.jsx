import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { WorkoutProvider } from './context/WorkoutContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <NotificationProvider>
            <WorkoutProvider>
              <AppRoutes />
            </WorkoutProvider>
          </NotificationProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
