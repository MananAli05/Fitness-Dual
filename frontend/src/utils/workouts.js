import { findExercise } from '../constants/exercises.js'
import { dashboardByGoal } from '../data/mockDashboard.js'
import { daysAgo, startOfWeek, toDateKey, weeksBetween } from './dates.js'

export function getTodaysPlan(goal) {
  const { workout } = dashboardByGoal[goal] ?? dashboardByGoal.bulk
  return { ...workout, exerciseIds: workout.exercises.map((exercise) => exercise.id) }
}

export function createDefaultSets(exerciseId, goal) {
  const exercise = findExercise(exerciseId)
  const target = exercise[goal] ?? exercise.bulk

  return Array.from({ length: target.sets }, () => ({
    reps: target.reps ?? '',
    seconds: target.seconds ?? '',
    weight: '',
    done: false,
  }))
}

export function formatTarget(exercise, goal) {
  const target = exercise[goal] ?? exercise.bulk
  return exercise.type === 'time' ? `${target.sets} × ${target.seconds}s` : `${target.sets} × ${target.reps}`
}

export function summarizeSets(sets) {
  return sets.reduce(
    (summary, set) => ({
      sets: summary.sets + 1,
      reps: summary.reps + (set.reps ?? 0),
      volume: summary.volume + (set.reps ?? 0) * Number(set.weight_kg ?? 0),
    }),
    { sets: 0, reps: 0, volume: 0 },
  )
}

export function groupSetsByExercise(sets) {
  const groups = []
  const sortedSets = [...sets].sort(
    (first, second) => first.position - second.position || first.set_number - second.set_number,
  )

  sortedSets.forEach((set) => {
    const lastGroup = groups[groups.length - 1]

    if (lastGroup && lastGroup.position === set.position) {
      lastGroup.sets.push(set)
    } else {
      groups.push({ position: set.position, exerciseId: set.exercise_id, name: set.exercise_name, sets: [set] })
    }
  })

  return groups
}

export function formatSet(set) {
  if (set.seconds) return `${set.seconds} sec`
  if (Number(set.weight_kg) > 0) return `${set.reps} reps × ${Number(set.weight_kg)} kg`
  return `${set.reps} reps`
}

export function getWeeklyMinutes(workouts, weekCount) {
  const thisWeek = startOfWeek(new Date())
  const weeks = Array.from({ length: weekCount }, (_, index) => {
    const start = new Date(thisWeek)
    start.setDate(start.getDate() - (weekCount - 1 - index) * 7)
    return {
      label: start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      value: 0,
    }
  })

  workouts.forEach((workout) => {
    const weeksAgo = weeksBetween(new Date(workout.started_at), thisWeek)
    const week = weeks[weekCount - 1 - weeksAgo]
    if (week) week.value += Math.round(workout.duration_seconds / 60)
  })

  return weeks
}

export function getStreakDays(workouts) {
  const workoutDays = new Set(workouts.map((workout) => toDateKey(new Date(workout.started_at))))
  let offset = workoutDays.has(toDateKey(daysAgo(0))) ? 0 : 1
  let streak = 0

  while (workoutDays.has(toDateKey(daysAgo(offset)))) {
    streak += 1
    offset += 1
  }

  return streak
}
