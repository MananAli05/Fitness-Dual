import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from '../components/common/Logo.jsx'
import { NAV_ITEMS } from '../constants/navigation.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useProfile } from '../context/ProfileContext.jsx'

function SidebarItem({ label, icon: Icon, to }) {
  const baseClass = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition'

  if (!to) {
    return (
      <span className={`${baseClass} cursor-not-allowed text-mute`} title="Coming soon">
        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        {label}
        <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] tracking-wider uppercase">
          Soon
        </span>
      </span>
    )
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${baseClass} ${isActive ? 'bg-volt font-semibold text-ink' : 'text-soft hover:bg-white/5 hover:text-paper'}`
      }
    >
      <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      {label}
    </NavLink>
  )
}

function MobileNavItem({ label, icon: Icon, to }) {
  if (!to) {
    return (
      <span className="flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] text-mute/50">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
        {label}
      </span>
    )
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] ${isActive ? 'text-volt' : 'text-mute'}`
      }
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
      {label}
    </NavLink>
  )
}

export default function AppLayout({ children }) {
  const { signOut } = useAuth()
  const { name } = useProfile()

  return (
    <div className="min-h-dvh bg-ink lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-white/6 bg-charcoal/60 p-5 lg:flex">
        <div className="px-2 pt-1 pb-8">
          <Logo size={30} />
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-white/6 bg-charcoal p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-volt text-sm font-bold text-ink uppercase">
            {name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold capitalize">{name}</p>
            <p className="text-xs text-mute">Free plan</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-lg p-2 text-mute transition hover:bg-white/5 hover:text-paper"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">{children}</div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-white/8 bg-charcoal/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        {NAV_ITEMS.filter((item) => item.mobile).map((item) => (
          <MobileNavItem key={item.label} {...item} />
        ))}
      </nav>
    </div>
  )
}
