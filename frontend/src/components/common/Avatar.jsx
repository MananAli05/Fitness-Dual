const SIZE_CLASSES = {
  sm: 'h-9 w-9 text-sm',
  lg: 'h-20 w-20 text-3xl',
}

export default function Avatar({ name, url, size = 'sm' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-volt font-bold text-ink uppercase ${SIZE_CLASSES[size]}`}
    >
      {url ? <img src={url} alt={name} className="h-full w-full object-cover" /> : name[0]}
    </span>
  )
}
