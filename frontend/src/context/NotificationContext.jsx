import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { countUnreadNotifications, createNotifications } from '../lib/notifications.js'
import { playNotificationTone } from '../utils/sound.js'
import { useAuth } from './AuthContext.jsx'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [unread, setUnread] = useState({ userId: null, count: 0 })
  const lastCountRef = useRef(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false
    lastCountRef.current = null

    countUnreadNotifications().then(({ count }) => {
      if (cancelled) return
      lastCountRef.current = count
      setUnread({ userId: user.id, count })
    })

    return () => {
      cancelled = true
    }
  }, [user])

  const refreshUnread = useCallback(async () => {
    const { count } = await countUnreadNotifications()
    if (lastCountRef.current !== null && count > lastCountRef.current) playNotificationTone()
    lastCountRef.current = count
    setUnread({ userId: user.id, count })
  }, [user])

  const syncNotifications = useCallback(
    async (notifications) => {
      if (notifications.length > 0) {
        await createNotifications(user.id, notifications)
      }
      await refreshUnread()
    },
    [user, refreshUnread],
  )

  const value = {
    unreadCount: user && unread.userId === user.id ? unread.count : 0,
    refreshUnread,
    syncNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  return useContext(NotificationContext)
}
