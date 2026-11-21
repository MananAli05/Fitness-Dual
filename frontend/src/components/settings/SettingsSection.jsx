import Card from '../common/Card.jsx'

export default function SettingsSection({ title, description, delay, children }) {
  return (
    <Card delay={delay}>
      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-mute">{description}</p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </Card>
  )
}
