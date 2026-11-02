import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '../components/common/Alert.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import PillButton from '../components/common/PillButton.jsx'
import NotificationItem from '../components/notifications/NotificationItem.jsx'
import CategoryFilter from '../components/workouts/CategoryFilter.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../lib/notifications.js'

const FILTERS = ['All', 'Unread']

export default function Notifications() {
  const navigate = useNavigate()
  const { refreshUnread } = useNotifications()
  const [notifications, setNotifications] = useState(null)
  const [filter, setFilter] = useState('All')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetchNotifications().then(({ data, error: fetchError }) => {
      if (cancelled) return
      setNotifications(data)
      setError(fetchError)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const unreadCount = (notifications ?? []).filter((notification) => !notification.read_at).length
  const visible = (notifications ?? []).filter((notification) => filter === 'All' || !notification.read_at)

  const setReadLocally = (isTarget) => {
    const readAt = new Date().toISOString()
    setNotifications((current) =>
      current.map((notification) =>
        isTarget(notification) && !notification.read_at ? { ...notification, read_at: readAt } : notification,
      ),
    )
  }

  const handleMarkRead = async (id) => {
    setError(null)
    const { error: markError } = await markNotificationRead(id)

    if (markError) {
      setError(markError)
      return
    }

    setReadLocally((notification) => notification.id === id)
    refreshUnread()
  }

  const handleMarkAllRead = async () => {
    setError(null)
    const { error: markError } = await markAllNotificationsRead()

    if (markError) {
      setError(markError)
      return
    }

    setReadLocally(() => true)
    refreshUnread()
  }

  const handleOpen = async (notification) => {
    if (!notification.read_at) {
      await markNotificationRead(notification.id)
      refreshUnread()
    }
    navigate(notification.link)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-8 lg:py-8">
        <PageHeader
          eyebrow={`${unreadCount} unread`}
          title="Notifications"
          subtitle="Reminders and progress updates based on your logs. Choose which ones you get in Settings."
        >
          <PillButton variant="outline" disabled={unreadCount === 0} onClick={handleMarkAllRead}>
            Mark all as read
          </PillButton>
        </PageHeader>

        {error && (
          <div className="mt-6">
            <Alert>{error}</Alert>
          </div>
        )}

        <div className="mt-8">
          <CategoryFilter categories={FILTERS} value={filter} onChange={setFilter} label="Filter notifications" />
        </div>

        <Card className="mt-4">
          {!notifications && <p className="text-sm text-mute">Loading notifications…</p>}
          {notifications && visible.length === 0 && (
            <p className="text-sm text-mute">
              {filter === 'Unread' ? 'You are all caught up.' : 'No notifications yet. Check back after using the app today.'}
            </p>
          )}
          {visible.length > 0 && (
            <ul className="-my-4 divide-y divide-line">
              {visible.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onOpen={handleOpen}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
