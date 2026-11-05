import { MailCheck } from 'lucide-react'
import Modal from '../common/Modal.jsx'

export default function ConfirmEmailModal({ email, onClose }) {
  const isGmail = email?.toLowerCase().endsWith('@gmail.com')

  return (
    <Modal open={Boolean(email)} onClose={onClose}>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-volt text-ink">
        <MailCheck className="h-7 w-7" strokeWidth={1.75} />
      </span>

      <h2 className="mt-6 text-3xl leading-tight font-semibold tracking-[-0.04em]">Confirm your email</h2>
      <p className="mt-3 text-soft">
        Your account is created. We sent a confirmation link to{' '}
        <span className="font-semibold break-all text-paper">{email}</span>.
      </p>

      <ol className="mt-6 space-y-3 text-sm">
        {['Open the email from PHAZE.', 'Click "Confirm email address".', 'Come back here and log in.'].map(
          (step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-semibold tabular-nums">
                {index + 1}
              </span>
              {step}
            </li>
          ),
        )}
      </ol>

      <p className="mt-6 text-xs text-mute">Can&apos;t find it? Check your spam or promotions folder.</p>

      <div className={`mt-6 grid gap-3 ${isGmail ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {isGmail && (
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noreferrer"
            className="flex h-12 items-center justify-center rounded-full bg-volt text-sm font-semibold text-ink transition hover:bg-volt-hi"
          >
            Open Gmail
          </a>
        )}
        <button
          type="button"
          onClick={onClose}
          className={`h-12 rounded-full text-sm font-semibold transition ${
            isGmail ? 'border border-line hover:border-paper' : 'bg-volt text-ink hover:bg-volt-hi'
          }`}
        >
          Got it
        </button>
      </div>
    </Modal>
  )
}
