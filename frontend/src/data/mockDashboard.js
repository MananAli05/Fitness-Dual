const shared = {
  streakDays: 6,
  water: { value: 5, target: 8 },
}

export const dashboardByGoal = {
  bulk: {
    ...shared,
    phase: { index: '01', name: 'Bulk', headline: 'Build. Fuel. Grow.', week: 3, totalWeeks: 12 },
    calories: { value: 1840, target: 2900 },
    protein: { value: 96, target: 160 },
    workout: {
      title: 'Lower body power',
      minutes: 45,
      exercises: [
        { id: 'squat', name: 'Squat', detail: '4 × 10', ai: true },
        { id: 'lunges', name: 'Lunges', detail: '3 × 12 each', ai: true },
        { id: 'jumping-jacks', name: 'Jumping jacks', detail: '3 × 30', ai: true },
        { id: 'plank', name: 'Plank', detail: '3 × 45s', ai: false },
      ],
    },
  },
  cut: {
    ...shared,
    phase: { index: '02', name: 'Cut', headline: 'Burn. Lean. Define.', week: 5, totalWeeks: 10 },
    calories: { value: 1320, target: 2050 },
    protein: { value: 104, target: 150 },
    workout: {
      title: 'Fat-burn circuit',
      minutes: 40,
      exercises: [
        { id: 'jumping-jacks', name: 'Jumping jacks', detail: '4 × 40', ai: true },
        { id: 'high-knees', name: 'High knees', detail: '4 × 30s', ai: true },
        { id: 'squat', name: 'Squat', detail: '3 × 15', ai: true },
        { id: 'shoulder-press', name: 'Shoulder press', detail: '3 × 12', ai: true },
      ],
    },
  },
}
