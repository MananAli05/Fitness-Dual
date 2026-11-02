import { supabase } from './supabase.js'

const NOTIFICATION_FIELDS = 'id, kind, title, body, link, read_at, created_at'

export async function fetchNotifications(limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select(NOTIFICATION_FIELDS)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data: data ?? [], error: error?.message ?? null }
}

export async function countUnreadNotifications() {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .is('read_at', null)

  return { count: count ?? 0, error: error?.message ?? null }
}

export async function createNotifications(userId, notifications) {
  const rows = notifications.map((notification) => ({ ...notification, user_id: userId }))
  const { error } = await supabase
    .from('notifications')
    .upsert(rows, { onConflict: 'user_id,dedupe_key', ignoreDuplicates: true })

  return { error: error?.message ?? null }
}

export async function markNotificationRead(id) {
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
  return { error: error?.message ?? null }
}

export async function markAllNotificationsRead() {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .is('read_at', null)

  return { error: error?.message ?? null }
}
