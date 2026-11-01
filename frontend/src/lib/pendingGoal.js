import { supabase } from './supabase.js'

const PENDING_GOAL_KEY = 'phaze.pendingGoal'

export function savePendingGoal(goal) {
  localStorage.setItem(PENDING_GOAL_KEY, goal)
}

export async function applyPendingGoal(userId) {
  const goal = localStorage.getItem(PENDING_GOAL_KEY)
  localStorage.removeItem(PENDING_GOAL_KEY)

  if (goal) {
    await supabase.from('profiles').update({ goal }).eq('id', userId)
  }
}
