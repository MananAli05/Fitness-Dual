import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../../lib/notifications.js'
import { formatDay, formatTime } from '../../utils/dates.js'

const PREVIEW_LIMIT = 6
const nowIso = () => new Date().toISOString()

export default function NotificationBell() {
  const navigate = useNavigate()
  const { unreadCount, refreshUnread } = useNotifications()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const closeOnOutside = (e) => {
      if (!panelRef.current?.contains(e.target)) setOpen(false)
    }
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const toggle = async () => {
    if (open) {
      setOpen(false)
      return
    }
    setOpen(true)
    const { data } = await fetchNotifications(PREVIEW_LIMIT)
    setItems(data)
  }

  const markRead = async (id) => {
    const readAt = nowIso()
    setItems((list) => list.map((item) => (item.id === id ? { ...item, read_at: readAt } : item)))
    await markNotificationRead(id)
    refreshUnread()
  }

  const markAllRead = async () => {
    const readAt = nowIso()
    setItems((list) => list.map((item) => ({ ...item, read_at: item.read_at ?? readAt })))
    await markAllNotificationsRead()
    refreshUnread()
  }

  const openItem = (item) => {
    if (!item.read_at) markRead(item.id)
    if (item.link) {
      setOpen(false)
      navigate(item.link)
    }
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-charcoal transition hover:border-white/25"
      >
        <Bell className="h-5 w-5" strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-volt px-1 text-[11px] font-bold text-ink tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-4 top-20 z-50 overflow-hidden rounded-3xl border border-line bg-charcoal shadow-2xl sm:absolute sm:inset-x-auto sm:top-14 sm:right-0 sm:w-96">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="text-sm text-teal hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {!items && <p className="px-5 py-6 text-sm text-mute">Loading…</p>}
            {items?.length === 0 && <p className="px-5 py-6 text-sm text-mute">You are all caught up.</p>}
            {items?.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openItem(item)}
                className="flex w-full gap-3 border-b border-line px-5 py-4 text-left transition last:border-0 hover:bg-white/5"
              >
                <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.read_at ? 'bg-transparent' : 'bg-volt'}`} />
                <span className="min-w-0">
                  <span className={`block font-semibold ${item.read_at ? 'text-soft' : 'text-paper'}`}>{item.title}</span>
                  <span className="mt-0.5 block text-sm text-mute">{item.body}</span>
                  <span className="mt-1 block text-xs text-mute">
                    {formatDay(item.created_at)}, {formatTime(item.created_at)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <Link
            to="/notifications"
            className="block border-t border-line px-5 py-3 text-center text-sm font-semibold text-volt hover:bg-white/5"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  )
}
