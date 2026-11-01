import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function TextField({ id, label, icon: Icon, error, hint, type = 'text', ...inputProps }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const PasswordIcon = showPassword ? EyeOff : Eye

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] font-medium tracking-[0.14em] text-mute uppercase">
        {label}
      </label>

      <div
        className={`group flex items-center gap-3 rounded-xl border px-4 transition ${
          error ? 'border-danger/70' : 'border-line hover:border-white/25 focus-within:border-volt'
        }`}
      >
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-mute transition group-focus-within:text-volt" strokeWidth={1.75} />
        )}
        <input
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          className="h-12 w-full bg-transparent text-[15px] text-paper outline-none placeholder:text-white/30"
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-mute transition hover:text-paper"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <PasswordIcon className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-mute">{hint}</p>}
    </div>
  )
}
