import { supabase } from './supabase.js'

const BUCKET = 'avatars'

function getAvatarPath(userId) {
  return `${userId}/avatar`
}

export async function uploadAvatar(userId, file) {
  const path = getAvatarPath(userId)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: '3600',
  })

  if (error) return { url: null, error: error.message }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: `${data.publicUrl}?v=${Date.now()}`, error: null }
}

export async function removeAvatar(userId) {
  const { error } = await supabase.storage.from(BUCKET).remove([getAvatarPath(userId)])
  return { error: error?.message ?? null }
}
