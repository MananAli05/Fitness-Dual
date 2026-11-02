import { PHASES } from '../constants/plans.js'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function getPhaseProgress(goal, phaseStartedAt) {
  const phase = PHASES[goal] ?? PHASES.bulk
  const startedAt = phaseStartedAt ? new Date(phaseStartedAt) : new Date()
  const weeksDone = Math.max(0, Math.floor((Date.now() - startedAt) / WEEK_MS))

  return {
    ...phase,
    startedAt,
    week: Math.min(phase.totalWeeks, weeksDone + 1),
    complete: weeksDone >= phase.totalWeeks,
  }
}
