import { ArrowUpRight, Loader2 } from 'lucide-react'

export default function PrimaryButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group flex h-13 w-full items-center justify-between rounded-full bg-volt pr-1.5 pl-6 font-semibold text-ink transition hover:bg-volt-hi active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span>{children}</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-volt transition-transform duration-300 group-hover:rotate-45">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
      </span>
    </button>
  )
}
