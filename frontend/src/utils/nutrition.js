export function sumMacros(logs) {
  return logs.reduce(
    (total, log) => ({
      calories: total.calories + log.calories,
      protein: total.protein + Number(log.protein_g),
      carbs: total.carbs + Number(log.carbs_g),
      fat: total.fat + Number(log.fat_g),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )
}

export function getDailyCalories(logs, dateKeys) {
  return dateKeys.map((dateKey) =>
    logs.filter((log) => log.log_date === dateKey).reduce((total, log) => total + log.calories, 0),
  )
}

export function getDailyWater(waterLogs, dateKeys) {
  return dateKeys.map((dateKey) => waterLogs.find((log) => log.log_date === dateKey)?.glasses ?? 0)
}
