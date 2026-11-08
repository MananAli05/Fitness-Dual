import { Apple, Bell, Dumbbell, LayoutGrid, LifeBuoy, LineChart, ScanLine, Settings, User } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid, to: '/home', mobile: true },
  { label: 'Workouts', icon: Dumbbell, to: '/workouts', mobile: true },
  { label: 'AI Coach', icon: ScanLine, to: '/ai-coach', mobile: false },
  { label: 'Progress', icon: LineChart, to: '/progress', mobile: true },
  { label: 'Nutrition', icon: Apple, to: '/nutrition', mobile: true },
  { label: 'Profile', icon: User, to: '/profile', mobile: true },
  { label: 'Notifications', icon: Bell, to: '/notifications', mobile: false },
  { label: 'Settings', icon: Settings, to: '/settings', mobile: false },
  { label: 'Help & Support', icon: LifeBuoy, to: '/help', mobile: false },
]

export const MOBILE_TOP_ITEMS = [
  { label: 'Notifications', icon: Bell, to: '/notifications' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]
