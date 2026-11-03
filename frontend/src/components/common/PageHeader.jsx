export default function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs tracking-[0.14em] text-mute uppercase">{eyebrow}</p>
        <h1 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] leading-none font-semibold tracking-[-0.04em]">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-soft">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  )
}
