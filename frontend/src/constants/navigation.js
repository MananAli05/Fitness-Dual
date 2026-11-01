import { Apple, Dumbbell, LayoutGrid, LineChart, ScanLine, Settings, User } from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid, to: '/home', mobile: true },
  { label: 'Workouts', icon: Dumbbell, to: '/workouts', mobile: true },
  { label: 'AI Coach', icon: ScanLine, to: null, mobile: false },
  { label: 'Progress', icon: LineChart, to: '/progress', mobile: true },
  { label: 'Nutrition', icon: Apple, to: '/nutrition', mobile: true },
  { label: 'Profile', icon: User, to: '/profile', mobile: true },
  { label: 'Settings', icon: Settings, to: null, mobile: false },
]
