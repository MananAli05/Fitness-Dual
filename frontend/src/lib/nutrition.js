import { supabase } from './supabase.js'

const FOOD_FIELDS = 'id, log_date, meal, name, calories, protein_g, carbs_g, fat_g, created_at'

export async function fetchFoodLogs(fromDate, toDate = fromDate) {
  const { data, error } = await supabase
    .from('food_logs')
    .select(FOOD_FIELDS)
    .gte('log_date', fromDate)
    .lte('log_date', toDate)
    .order('created_at')

  return { data: data ?? [], error: error?.message ?? null }
}

export async function addFoodLog(userId, entry) {
  const { data, error } = await supabase
    .from('food_logs')
    .insert({ ...entry, user_id: userId })
    .select(FOOD_FIELDS)
    .single()

  return { data, error: error?.message ?? null }
}

export async function deleteFoodLog(id) {
  const { error } = await supabase.from('food_logs').delete().eq('id', id)
  return { error: error?.message ?? null }
}

export async function fetchWaterLogs(fromDate, toDate = fromDate) {
  const { data, error } = await supabase
    .from('water_logs')
    .select('log_date, glasses')
    .gte('log_date', fromDate)
    .lte('log_date', toDate)

  return { data: data ?? [], error: error?.message ?? null }
}

export async function saveWaterGlasses(userId, logDate, glasses) {
  const { error } = await supabase
    .from('water_logs')
    .upsert({ user_id: userId, log_date: logDate, glasses }, { onConflict: 'user_id,log_date' })

  return { error: error?.message ?? null }
}
