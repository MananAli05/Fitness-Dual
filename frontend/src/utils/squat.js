const UP_ANGLE = 160
const DOWN_ANGLE = 100
const START_ANGLE = 145
const MIN_VISIBILITY = 0.5
const KNEE_GAP_RATIO = 0.75

const SIDES = {
  left: { shoulder: 11, hip: 23, knee: 25, ankle: 27 },
  right: { shoulder: 12, hip: 24, knee: 26, ankle: 28 },
}

export const BONES = [
  ['shoulder', 'hip'],
  ['hip', 'knee'],
  ['knee', 'ankle'],
]

export function getAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  const degrees = Math.abs((radians * 180) / Math.PI)
  return degrees > 180 ? 360 - degrees : degrees
}

export function smoothPoints(previous, current, alpha = 0.5) {
  if (!previous) return current
  return current.map((point, index) => ({
    x: alpha * point.x + (1 - alpha) * previous[index].x,
    y: alpha * point.y + (1 - alpha) * previous[index].y,
    visibility: point.visibility,
  }))
}

function pickSide(points) {
  const score = (side) => Object.values(SIDES[side]).reduce((sum, index) => sum + points[index].visibility, 0)
  return score('left') >= score('right') ? 'left' : 'right'
}

function areKneesIn(points) {
  const shoulderWidth = Math.abs(points[11].x - points[12].x)
  const torsoLength = Math.abs(points[11].y - points[23].y)
  const isFrontView = shoulderWidth > torsoLength * 0.5
  if (!isFrontView) return false

  const kneeGap = Math.abs(points[25].x - points[26].x)
  const ankleGap = Math.abs(points[27].x - points[28].x)
  return kneeGap < ankleGap * KNEE_GAP_RATIO
}

export function readSquat(points) {
  const side = pickSide(points)
  const joints = Object.fromEntries(Object.entries(SIDES[side]).map(([name, index]) => [name, points[index]]))
  const visible = Object.values(joints).every((point) => point.visibility > MIN_VISIBILITY)
  if (!visible) return null

  return {
    joints,
    knee: getAngle(joints.hip, joints.knee, joints.ankle),
    kneesIn: areKneesIn(points),
  }
}

export class SquatCounter {
  stage = 'up'
  lowest = 180
  kneesIn = false
  reps = 0
  noReps = 0

  update({ knee, kneesIn }) {
    if (knee < START_ANGLE) {
      this.lowest = Math.min(this.lowest, knee)
      if (kneesIn) this.kneesIn = true
    }

    if (this.stage === 'up' && knee < DOWN_ANGLE) this.stage = 'down'
    if (knee < UP_ANGLE) return null

    const result = this.finishRep()
    this.stage = 'up'
    this.lowest = 180
    this.kneesIn = false
    return result
  }

  finishRep() {
    if (this.lowest >= START_ANGLE) return null
    if (this.stage === 'up') {
      this.noReps += 1
      return 'shallow'
    }
    if (this.kneesIn) {
      this.noReps += 1
      return 'knees'
    }
    this.reps += 1
    return 'good'
  }
}
