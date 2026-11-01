import { motion } from 'framer-motion'
import { useId } from 'react'

const LOGO_PATHS = [
  'M26 17H66C80 17 89 27 86 40C83 54 72 62 58 62H33L37 48H58C64 48 69 45 70 40C71 35 68 31 63 31H22Z',
  'M31 48H48L38 84H21Z',
]

export function LogoMark({ size = 40, animate = false }) {
  const gradientId = useId()
  const drawAnimation = animate
    ? { initial: { pathLength: 0, fillOpacity: 0 }, animate: { pathLength: 1, fillOpacity: 1 } }
    : {}

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0.1" stopColor="#b6f22c" />
          <stop offset="0.9" stopColor="#14e1ff" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="#111214" />
      {LOGO_PATHS.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill={`url(#${gradientId})`}
          stroke={`url(#${gradientId})`}
          strokeWidth={animate ? 0.8 : 0}
          {...drawAnimation}
          transition={{
            pathLength: { duration: 0.9, delay: index * 0.15, ease: [0.65, 0, 0.35, 1] },
            fillOpacity: { duration: 0.4, delay: 0.7 + index * 0.1 },
          }}
        />
      ))}
    </svg>
  )
}

export function Wordmark({ className = '' }) {
  return <span className={`font-semibold tracking-[0.18em] ${className}`}>PHΛZE</span>
}

export default function Logo({ size = 34 }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={size} />
      <Wordmark className="text-base" />
    </div>
  )
}
