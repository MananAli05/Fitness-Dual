import { getAngle, isVisible } from '../utils/reps.js'

const ARMS = {
  left: { shoulder: 11, elbow: 13, wrist: 15 },
  right: { shoulder: 12, elbow: 14, wrist: 16 },
}
const ARM_BONES = [
  ['shoulder', 'elbow'],
  ['elbow', 'wrist'],
]

function visibleSides(view) {
  return [view.left, view.right].filter(Boolean)
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function elbowAngle(arm) {
  return getAngle(arm.shoulder, arm.elbow, arm.wrist)
}

function armRaise(arm) {
  const below = { x: arm.shoulder.x, y: arm.shoulder.y + 1 }
  return getAngle(below, arm.shoulder, arm.elbow)
}

function shoulderWidth(points) {
  return isVisible(points[11], points[12]) ? Math.abs(points[11].x - points[12].x) : null
}

function areElbowsOut(arms, points) {
  const width = shoulderWidth(points)
  if (!width) return false
  return arms.some((arm) => Math.abs(arm.elbow.x - arm.shoulder.x) > width * 0.5)
}

function areKneesIn(points) {
  if (!isVisible(points[25], points[26], points[27], points[28])) return false
  const width = shoulderWidth(points)
  const torsoLength = Math.abs(points[11].y - points[23].y)
  if (!width || width < torsoLength * 0.5) return false

  const kneeGap = Math.abs(points[25].x - points[26].x)
  const ankleGap = Math.abs(points[27].x - points[28].x)
  return kneeGap < ankleGap * 0.75
}

function areLegsOpen(points) {
  if (!isVisible(points[23], points[24], points[27], points[28])) return true
  const hipWidth = Math.abs(points[23].x - points[24].x)
  const ankleGap = Math.abs(points[27].x - points[28].x)
  return ankleGap > hipWidth * 1.5
}

export const AI_RULES = {
  squat: {
    sides: {
      left: { shoulder: 11, hip: 23, knee: 25, ankle: 27 },
      right: { shoulder: 12, hip: 24, knee: 26, ankle: 28 },
    },
    bones: [
      ['shoulder', 'hip'],
      ['hip', 'knee'],
      ['knee', 'ankle'],
    ],
    rest: 160,
    target: 100,
    start: 145,
    measure: (view, points) => {
      const legs = visibleSides(view)
      if (legs.length === 0) return null
      const leg = legs.reduce((best, side) => (side.knee.visibility > best.knee.visibility ? side : best))
      return {
        angle: getAngle(leg.hip, leg.knee, leg.ankle),
        fault: areKneesIn(points) ? 'knees' : null,
      }
    },
    messages: {
      shallow: 'Go lower',
      knees: 'Push your knees out',
    },
  },

  'bicep-curl': {
    sides: ARMS,
    bones: ARM_BONES,
    rest: 150,
    target: 60,
    start: 120,
    measure: (view, points) => {
      const arms = visibleSides(view)
      if (arms.length === 0) return null
      return {
        angle: average(arms.map(elbowAngle)),
        fault: areElbowsOut(arms, points) ? 'elbows' : null,
      }
    },
    messages: {
      shallow: 'Curl all the way up',
      elbows: 'Keep your elbows close to your body',
    },
  },

  'shoulder-press': {
    sides: ARMS,
    bones: ARM_BONES,
    rest: 105,
    target: 155,
    start: 125,
    measure: (view) => {
      const arms = visibleSides(view)
      if (arms.length === 0) return null
      return {
        angle: average(arms.map(elbowAngle)),
        reset: arms.every((arm) => arm.wrist.y > arm.elbow.y),
      }
    },
    messages: {
      shallow: 'Press all the way up',
    },
  },

  'lateral-raise': {
    sides: ARMS,
    bones: ARM_BONES,
    rest: 30,
    target: 75,
    start: 50,
    measure: (view) => {
      const arms = visibleSides(view)
      if (arms.length === 0) return null
      const angles = arms.map(armRaise)
      return {
        angle: average(angles),
        fault: angles.length === 2 && Math.abs(angles[0] - angles[1]) > 25 ? 'uneven' : null,
      }
    },
    messages: {
      shallow: 'Raise your arms to shoulder height',
      uneven: 'Lift both arms evenly',
    },
  },

  'jumping-jacks': {
    sides: ARMS,
    bones: ARM_BONES,
    rest: 40,
    target: 140,
    start: 80,
    measure: (view, points) => {
      const arms = visibleSides(view)
      if (arms.length === 0) return null
      const angle = average(arms.map(armRaise))
      return { angle, fault: angle > 140 && !areLegsOpen(points) ? 'legs' : null }
    },
    messages: {
      shallow: 'Bring your arms all the way up',
      legs: 'Jump your feet out wider',
    },
  },
}
