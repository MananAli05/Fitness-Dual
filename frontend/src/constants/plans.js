export const PHASES = {
  bulk: { index: '01', name: 'Bulk', headline: 'Build. Fuel. Grow.', totalWeeks: 12 },
  cut: { index: '02', name: 'Cut', headline: 'Burn. Lean. Define.', totalWeeks: 10 },
}

export const WEEKLY_PLANS = {
  bulk: [
    { title: 'Active recovery', exerciseIds: ['plank', 'glute-bridge', 'superman'] },
    { title: 'Push day', exerciseIds: ['dumbbell-bench-press', 'push-up', 'shoulder-press', 'tricep-dip'] },
    { title: 'Leg day', exerciseIds: ['squat', 'romanian-deadlift', 'lunges', 'glute-bridge'] },
    { title: 'Pull day', exerciseIds: ['bent-over-row', 'superman', 'bicep-curl', 'lateral-raise'] },
    { title: 'Upper body', exerciseIds: ['push-up', 'bent-over-row', 'shoulder-press', 'bicep-curl'] },
    { title: 'Lower body and core', exerciseIds: ['squat', 'lunges', 'glute-bridge', 'plank'] },
    { title: 'Full body strength', exerciseIds: ['dumbbell-bench-press', 'romanian-deadlift', 'bent-over-row', 'plank'] },
  ],
  cut: [
    { title: 'Active recovery', exerciseIds: ['plank', 'superman', 'glute-bridge'] },
    { title: 'Fat-burn circuit', exerciseIds: ['jumping-jacks', 'high-knees', 'squat', 'shoulder-press'] },
    { title: 'Upper body burn', exerciseIds: ['push-up', 'bent-over-row', 'lateral-raise', 'mountain-climbers'] },
    { title: 'Core and cardio', exerciseIds: ['plank', 'mountain-climbers', 'high-knees', 'burpees'] },
    { title: 'Lower body burn', exerciseIds: ['lunges', 'glute-bridge', 'squat', 'jumping-jacks'] },
    { title: 'Full body HIIT', exerciseIds: ['burpees', 'push-up', 'squat', 'mountain-climbers'] },
    { title: 'Cardio and core', exerciseIds: ['jumping-jacks', 'high-knees', 'plank', 'superman'] },
  ],
}

export const BEGINNER_SWAPS = {
  'dumbbell-bench-press': 'push-up',
  'romanian-deadlift': 'glute-bridge',
  'bent-over-row': 'superman',
  burpees: 'jumping-jacks',
}

export const LEVEL_SET_CHANGE = {
  beginner: -1,
  intermediate: 0,
  advanced: 1,
}

export const MINUTES_PER_SET = {
  bulk: 2.5,
  cut: 1.75,
}
