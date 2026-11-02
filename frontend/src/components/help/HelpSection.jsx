import Card from '../common/Card.jsx'

export default function HelpSection({ title, topics, delay }) {
  return (
    <Card title={title} delay={delay}>
      <div className="-my-1 divide-y divide-line">
        {topics.map((topic) => (
          <details key={topic.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              {topic.question}
              <span className="text-mute transition-transform group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-soft">{topic.answer}</p>
          </details>
        ))}
      </div>
    </Card>
  )
}
