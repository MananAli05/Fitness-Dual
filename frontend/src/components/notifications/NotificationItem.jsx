import PillButton from '../common/PillButton.jsx'
import { formatDay, formatTime } from '../../utils/dates.js'

const KIND_LABELS = { reminder: 'Reminder', progress: 'Progress' }

export default function NotificationItem({ notification, onOpen, onMarkRead }) {
  const unread = !notification.read_at

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex min-w-0 flex-1 gap-3">
        <span
          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${unread ? 'bg-volt' : 'bg-transparent'}`}
          aria-label={unread ? 'Unread' : undefined}
        />
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.14em] text-mute uppercase">
            {KIND_LABELS[notification.kind]} · {formatDay(notification.created_at)}, {formatTime(notification.created_at)}
          </p>
          <p className={`mt-1 font-semibold ${unread ? 'text-paper' : 'text-soft'}`}>{notification.title}</p>
          <p className="mt-0.5 text-sm text-mute">{notification.body}</p>
        </div>
      </div>

      <div className="flex shrink-0 gap-2 pl-5 sm:pl-0">
        {unread && (
          <PillButton variant="outline" size="small" onClick={() => onMarkRead(notification.id)}>
            Mark as read
          </PillButton>
        )}
        {notification.link && (
          <PillButton size="small" onClick={() => onOpen(notification)}>
            Open
          </PillButton>
        )}
      </div>
    </li>
  )
}
