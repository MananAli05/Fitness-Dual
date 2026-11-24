const MIN_VISIBILITY = 0.5
const FAULT_FRAMES = 6

export function getAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  const degrees = Math.abs((radians * 180) / Math.PI)
  return degrees > 180 ? 360 - degrees : degrees
}

export function toSquarePoints(landmarks, aspect) {
  return landmarks.map((point) => ({ x: point.x * aspect, y: point.y, visibility: point.visibility }))
}

export function smoothPoints(previous, current, alpha = 0.5) {
  if (!previous) return current
  return current.map((point, index) => ({
    x: alpha * point.x + (1 - alpha) * previous[index].x,
    y: alpha * point.y + (1 - alpha) * previous[index].y,
    visibility: point.visibility,
  }))
}

export function isVisible(...points) {
  return points.every((point) => point.visibility > MIN_VISIBILITY)
}

export function readSides(points, sides) {
  const read = (side) => {
    const joints = Object.fromEntries(Object.entries(sides[side]).map(([name, index]) => [name, points[index]]))
    return isVisible(...Object.values(joints)) ? joints : null
  }
  return { left: read('left'), right: read('right') }
}

export class RepCounter {
  stage = 'rest'
  moved = false
  fault = null
  faultFrames = 0
  reps = 0
  noReps = 0

  constructor({ rest, target, start }) {
    this.direction = target < rest ? 1 : -1
    this.rest = rest * this.direction
    this.target = target * this.direction
    this.start = start * this.direction
  }

  update({ angle: rawAngle, fault, reset }) {
    if (reset) {
      this.clear()
      return null
    }

    const angle = rawAngle * this.direction
    this.faultFrames = fault ? this.faultFrames + 1 : 0

    if (angle < this.start) {
      this.moved = true
      if (this.faultFrames >= FAULT_FRAMES) this.fault = fault
    }

    if (angle < this.target) this.stage = 'target'
    if (angle < this.rest) return null

    const result = this.finishRep()
    this.clear()
    return result
  }

  clear() {
    this.stage = 'rest'
    this.moved = false
    this.fault = null
    this.faultFrames = 0
  }

  finishRep() {
    if (!this.moved) return null
    if (this.stage === 'rest') {
      this.noReps += 1
      return 'shallow'
    }
    if (this.fault) {
      this.noReps += 1
      return this.fault
    }
    this.reps += 1
    return 'good'
  }
}
