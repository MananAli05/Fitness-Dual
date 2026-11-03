const DAY_MS = 24 * 60 * 60 * 1000

export function toDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function daysAgo(count) {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - count)
  return date
}

export function lastDateKeys(count) {
  return Array.from({ length: count }, (_, index) => toDateKey(daysAgo(count - 1 - index)))
}

export function startOfWeek(date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)
  return start
}

export function weeksBetween(earlier, later) {
  return Math.round((startOfWeek(later) - startOfWeek(earlier)) / (7 * DAY_MS))
}

export function formatDuration(seconds) {
  const minutes = Math.max(1, Math.round(seconds / 60))
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  return `${hours} h ${String(minutes % 60).padStart(2, '0')} min`
}

export function formatClock(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const rest = String(seconds % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${minutes}:${rest}` : `${minutes}:${rest}`
}

export function formatDay(value) {
  const date = typeof value === 'string' && value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}
