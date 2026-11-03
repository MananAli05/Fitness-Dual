import { useEffect, useState } from 'react'
import { formatClock } from '../../utils/dates.js'

export default function SessionTimer({ startedAt }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAt)) / 1000))

  return <span className="tabular-nums">{formatClock(elapsedSeconds)}</span>
}
