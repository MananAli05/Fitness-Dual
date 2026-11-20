import { getAngle } from '../utils/reps.js'

function areKneesIn(points) {
  const shoulderWidth = Math.abs(points[11].x - points[12].x)
  const torsoLength = Math.abs(points[11].y - points[23].y)
  if (shoulderWidth < torsoLength * 0.5) return false

  const kneeGap = Math.abs(points[25].x - points[26].x)
  const ankleGap = Math.abs(points[27].x - points[28].x)
  return kneeGap < ankleGap * 0.75
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
    measure: (joints, points) => ({
      angle: getAngle(joints.hip, joints.knee, joints.ankle),
      fault: areKneesIn(points) ? 'knees' : null,
    }),
    messages: {
      shallow: 'Go lower',
      knees: 'Push your knees out',
    },
  },

  'bicep-curl': {
    sides: {
      left: { hip: 23, shoulder: 11, elbow: 13, wrist: 15 },
      right: { hip: 24, shoulder: 12, elbow: 14, wrist: 16 },
    },
    bones: [
      ['hip', 'shoulder'],
      ['shoulder', 'elbow'],
      ['elbow', 'wrist'],
    ],
    rest: 150,
    target: 50,
    start: 120,
    measure: (joints) => ({
      angle: getAngle(joints.shoulder, joints.elbow, joints.wrist),
      fault: getAngle(joints.hip, joints.shoulder, joints.elbow) > 40 ? 'elbows' : null,
    }),
    messages: {
      shallow: 'Curl all the way up',
      elbows: 'Keep your elbows still',
    },
  },

  'shoulder-press': {
    sides: {
      left: { shoulder: 11, elbow: 13, wrist: 15 },
      right: { shoulder: 12, elbow: 14, wrist: 16 },
    },
    bones: [
      ['shoulder', 'elbow'],
      ['elbow', 'wrist'],
    ],
    rest: 105,
    target: 155,
    start: 125,
    measure: (joints) => ({
      angle: getAngle(joints.shoulder, joints.elbow, joints.wrist),
      reset: joints.wrist.y > joints.elbow.y,
    }),
    messages: {
      shallow: 'Press all the way up',
    },
  },
}
