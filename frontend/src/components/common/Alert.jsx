import { CircleAlert, CircleCheck } from 'lucide-react'

export default function Alert({ type = 'error', children }) {
  const isSuccess = type === 'success'
  const Icon = isSuccess ? CircleCheck : CircleAlert

  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm ${
        isSuccess ? 'border-volt/40 text-volt' : 'border-danger/40 text-danger'
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span>{children}</span>
    </div>
  )
}
