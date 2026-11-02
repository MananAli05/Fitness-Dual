import { DEFAULT_SETTINGS } from '../constants/settings.js'
import { supabase } from './supabase.js'

const SETTINGS_FIELDS = 'workout_reminders, meal_reminders, water_reminders, progress_updates'

export async function fetchSettings(userId) {
  const { data, error } = await supabase.from('user_settings').select(SETTINGS_FIELDS).eq('user_id', userId).maybeSingle()
  return { data: { ...DEFAULT_SETTINGS, ...data }, error: error?.message ?? null }
}

export async function saveSettings(userId, settings) {
  const { error } = await supabase
    .from('user_settings')
    .upsert({ ...settings, user_id: userId }, { onConflict: 'user_id' })

  return { error: error?.message ?? null }
}
