import { Camera, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { AVATAR_MAX_BYTES, AVATAR_TYPES } from '../../constants/avatar.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProfile } from '../../context/ProfileContext.jsx'
import { removeAvatar, uploadAvatar } from '../../lib/avatars.js'
import Avatar from '../common/Avatar.jsx'

function getFileError(file) {
  if (!AVATAR_TYPES.includes(file.type)) return 'Use a JPG, PNG or WebP image.'
  if (file.size > AVATAR_MAX_BYTES) return 'Image is too large. The limit is 2 MB.'
  return null
}

export default function AvatarUpload({ children }) {
  const { user } = useAuth()
  const { profile, name, save } = useProfile()
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const avatarUrl = profile?.avatar_url

  const handleFile = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    const fileError = getFileError(file)
    if (fileError) {
      setError(fileError)
      return
    }

    setBusy(true)
    setError(null)

    const { url, error: uploadError } = await uploadAvatar(user.id, file)
    const { error: saveError } = uploadError ? {} : await save({ avatar_url: url })

    setBusy(false)
    setError(uploadError ?? saveError ?? null)
  }

  const handleRemove = async () => {
    setBusy(true)
    setError(null)

    const { error: removeError } = await removeAvatar(user.id)
    const { error: saveError } = removeError ? {} : await save({ avatar_url: null })

    setBusy(false)
    setError(removeError ?? saveError ?? null)
  }

  return (
    <div className="flex min-w-0 items-center gap-5">
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        disabled={busy}
        className="group relative rounded-full"
        aria-label="Change profile photo"
      >
        <Avatar name={name} url={avatarUrl} size="lg" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 opacity-0 transition group-hover:opacity-100">
          <Camera className="h-6 w-6 text-paper" strokeWidth={1.75} />
        </span>
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
            <Loader2 className="h-6 w-6 animate-spin text-paper" />
          </span>
        )}
        <span className="absolute -right-0.5 -bottom-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-teal text-ink">
          <Camera className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_TYPES.join(',')}
        onChange={handleFile}
        className="hidden"
      />

      <div className="min-w-0">
        {children}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            disabled={busy}
            className="font-medium text-teal hover:underline disabled:opacity-50"
          >
            {avatarUrl ? 'Change photo' : 'Add photo'}
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={busy}
              className="text-mute hover:text-paper disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-mute">JPG, PNG or WebP. Max 2 MB.</p>
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>
    </div>
  )
}
