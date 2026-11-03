import { Link } from 'react-router-dom'

const VARIANT_CLASSES = {
  primary: 'bg-volt font-semibold text-ink hover:bg-volt-hi',
  outline: 'border border-line font-medium text-paper hover:border-paper',
  danger: 'border border-danger/40 font-medium text-danger hover:border-danger',
}

const SIZE_CLASSES = {
  regular: 'h-12 px-6',
  small: 'h-10 px-4',
}

export default function PillButton({ to, variant = 'primary', size = 'regular', className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center rounded-full text-sm whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
