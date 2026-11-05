import { createContext, useContext, useEffect, useState } from 'react'
import { findExercise } from '../constants/exercises.js'
import { saveWorkout } from '../lib/workouts.js'
import { createDefaultSets } from '../utils/workouts.js'
import { useAuth } from './AuthContext.jsx'
import { useProfile } from './ProfileContext.jsx'

const WorkoutContext = createContext(null)

const STORAGE_KEY = 'phaze.activeWorkout'

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

function isCompleteSet(set, exercise) {
  const value = exercise.type === 'time' ? set.seconds : set.reps
  return set.done && Number(value) > 0
}

function buildSetRows(exercises) {
  return exercises.flatMap((entry, position) => {
    const exercise = findExercise(entry.exerciseId)

    return entry.sets
      .filter((set) => isCompleteSet(set, exercise))
      .map((set, index) => ({
        exercise_id: exercise.id,
        exercise_name: exercise.name,
        position,
        set_number: index + 1,
        reps: exercise.type === 'reps' ? Number(set.reps) : null,
        seconds: exercise.type === 'time' ? Number(set.seconds) : null,
        weight_kg: exercise.type === 'reps' && set.weight !== '' ? Number(set.weight) : null,
      }))
  })
}

export function WorkoutProvider({ children }) {
  const { user } = useAuth()
  const { goal, level } = useProfile()
  const [draft, setDraft] = useState(loadDraft)

  useEffect(() => {
    if (draft) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [draft])

  const activeWorkout = user && draft?.userId === user.id ? draft : null

  const createEntry = (exerciseId) => ({
    key: crypto.randomUUID(),
    exerciseId,
    sets: createDefaultSets(exerciseId, goal, level),
  })

  const updateExercises = (update) => {
    setDraft((current) => ({ ...current, exercises: update(current.exercises) }))
  }

  const updateEntry = (key, update) => {
    updateExercises((exercises) => exercises.map((entry) => (entry.key === key ? update(entry) : entry)))
  }

  const startWorkout = ({ title, exerciseIds = [] }) => {
    setDraft({
      userId: user.id,
      title,
      goal,
      startedAt: new Date().toISOString(),
      exercises: exerciseIds.filter(findExercise).map(createEntry),
    })
  }

  const addExercise = (exerciseId) => {
    updateExercises((exercises) => [...exercises, createEntry(exerciseId)])
  }

  const removeExercise = (key) => {
    updateExercises((exercises) => exercises.filter((entry) => entry.key !== key))
  }

  const updateSet = (key, setIndex, changes) => {
    updateEntry(key, (entry) => ({
      ...entry,
      sets: entry.sets.map((set, index) => (index === setIndex ? { ...set, ...changes } : set)),
    }))
  }

  const addSet = (key) => {
    updateEntry(key, (entry) => {
      const lastSet = entry.sets[entry.sets.length - 1] ?? createDefaultSets(entry.exerciseId, goal, level)[0]
      return { ...entry, sets: [...entry.sets, { ...lastSet, done: false }] }
    })
  }

  const removeSet = (key, setIndex) => {
    updateEntry(key, (entry) => ({ ...entry, sets: entry.sets.filter((_, index) => index !== setIndex) }))
  }

  const renameWorkout = (title) => {
    setDraft((current) => ({ ...current, title }))
  }

  const discardWorkout = () => setDraft(null)

  const finishWorkout = async () => {
    const sets = buildSetRows(activeWorkout.exercises)

    if (sets.length === 0) {
      return { id: null, error: 'Mark at least one set as done before finishing.' }
    }

    const result = await saveWorkout({
      userId: user.id,
      title: activeWorkout.title.trim() || 'Workout',
      goal: activeWorkout.goal,
      startedAt: activeWorkout.startedAt,
      finishedAt: new Date().toISOString(),
      sets,
    })

    if (!result.error) setDraft(null)
    return result
  }

  const value = {
    activeWorkout,
    startWorkout,
    addExercise,
    removeExercise,
    updateSet,
    addSet,
    removeSet,
    renameWorkout,
    discardWorkout,
    finishWorkout,
  }

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
}

export function useWorkout() {
  return useContext(WorkoutContext)
}
