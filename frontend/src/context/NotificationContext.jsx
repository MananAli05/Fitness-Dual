import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { countUnreadNotifications, createNotifications } from '../lib/notifications.js'
import { useAuth } from './AuthContext.jsx'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [unread, setUnread] = useState({ userId: null, count: 0 })

  useEffect(() => {
    if (!user) return

    let cancelled = false

    countUnreadNotifications().then(({ count }) => {
      if (!cancelled) setUnread({ userId: user.id, count })
    })

    return () => {
      cancelled = true
    }
  }, [user])

  const refreshUnread = useCallback(async () => {
    const { count } = await countUnreadNotifications()
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
