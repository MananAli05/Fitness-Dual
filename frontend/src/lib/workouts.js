import { supabase } from './supabase.js'

const WORKOUT_FIELDS =
  'id, title, goal, started_at, finished_at, duration_seconds, workout_sets (exercise_id, exercise_name, position, set_number, reps, weight_kg, seconds)'

export async function saveWorkout({ userId, title, goal, startedAt, finishedAt, sets }) {
  const durationSeconds = Math.round((new Date(finishedAt) - new Date(startedAt)) / 1000)

  const { data: workout, error } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      title,
      goal,
      started_at: startedAt,
      finished_at: finishedAt,
      duration_seconds: durationSeconds,
    })
    .select('id')
    .single()

  if (error) return { id: null, error: error.message }

  const rows = sets.map((set) => ({ ...set, user_id: userId, workout_id: workout.id }))
  const { error: setsError } = await supabase.from('workout_sets').insert(rows)

  if (setsError) {
    await supabase.from('workouts').delete().eq('id', workout.id)
    return { id: null, error: setsError.message }
  }

  return { id: workout.id, error: null }
}

export async function fetchWorkouts({ since, limit } = {}) {
  let query = supabase.from('workouts').select(WORKOUT_FIELDS).order('started_at', { ascending: false })

  if (since) query = query.gte('started_at', since.toISOString())
  if (limit) query = query.limit(limit)

  const { data, error } = await query
  return { data: data ?? [], error: error?.message ?? null }
}

export async function fetchWorkout(id) {
  const { data, error } = await supabase.from('workouts').select(WORKOUT_FIELDS).eq('id', id).maybeSingle()
  return { data, error: error?.message ?? null }
}

export async function deleteWorkout(id) {
  const { error } = await supabase.from('workouts').delete().eq('id', id)
  return { error: error?.message ?? null }
}
