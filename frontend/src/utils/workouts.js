import { findExercise } from '../constants/exercises.js'
import { BEGINNER_SWAPS, LEVEL_SET_CHANGE, MINUTES_PER_SET, WEEKLY_PLANS } from '../constants/plans.js'
import { daysAgo, startOfWeek, toDateKey, weeksBetween } from './dates.js'

export function getTarget(exercise, goal, level) {
  const target = exercise[goal] ?? exercise.bulk
  const sets = Math.max(2, target.sets + (LEVEL_SET_CHANGE[level] ?? 0))
  return { ...target, sets }
}

export function formatTarget(exercise, goal, level) {
  const target = getTarget(exercise, goal, level)
  return exercise.type === 'time' ? `${target.sets} × ${target.seconds}s` : `${target.sets} × ${target.reps}`
}

function getPlanExerciseIds(exerciseIds, level) {
  const ids = level === 'beginner' ? exerciseIds.map((id) => BEGINNER_SWAPS[id] ?? id) : exerciseIds
  return [...new Set(ids)]
}

export function getTodaysPlan(goal, level, date = new Date()) {
  const week = WEEKLY_PLANS[goal] ?? WEEKLY_PLANS.bulk
  const day = week[date.getDay()]
  const exerciseIds = getPlanExerciseIds(day.exerciseIds, level)

  const exercises = exerciseIds.map(findExercise).map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    sets: getTarget(exercise, goal, level).sets,
    detail: formatTarget(exercise, goal, level),
  }))

  const totalSets = exercises.reduce((total, exercise) => total + exercise.sets, 0)
  const minutes = Math.round((totalSets * (MINUTES_PER_SET[goal] ?? MINUTES_PER_SET.bulk)) / 5) * 5

  return { title: day.title, minutes, exerciseIds, exercises }
}

export function createDefaultSets(exerciseId, goal, level) {
  const target = getTarget(findExercise(exerciseId), goal, level)

  return Array.from({ length: target.sets }, () => ({
    reps: target.reps ?? '',
    seconds: target.seconds ?? '',
    weight: '',
    done: false,
  }))
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
