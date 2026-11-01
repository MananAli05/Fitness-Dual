const ACTIVITY_FACTOR = { low: 1.375, moderate: 1.55, high: 1.725 }
const GOAL_CALORIES = { bulk: 300, cut: -500 }
const PROTEIN_PER_KG = { bulk: 1.8, cut: 2.2 }
const GENDER_OFFSET = { male: 5, female: -161, other: -78 }
const MIN_CALORIES = { male: 1500, female: 1200, other: 1350 }

function hasBodyData(profile) {
  return profile?.age && profile?.height_cm && profile?.weight_kg && profile?.gender && profile?.activity_level
}

export function calculateTargets(profile) {
  if (!hasBodyData(profile)) return null

  const goal = profile.goal === 'cut' ? 'cut' : 'bulk'
  const weight = Number(profile.weight_kg)
  const height = Number(profile.height_cm)
  const age = Number(profile.age)

  const bmr = 10 * weight + 6.25 * height - 5 * age + GENDER_OFFSET[profile.gender]
  const maintenance = bmr * ACTIVITY_FACTOR[profile.activity_level]
  const goalCalories = Math.round((maintenance + GOAL_CALORIES[goal]) / 10) * 10
  const calories = Math.max(MIN_CALORIES[profile.gender], goalCalories)

  const protein = Math.round(weight * PROTEIN_PER_KG[goal])
  const fat = Math.round((calories * 0.25) / 9)
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4))
  const water = Math.max(8, Math.round((weight * 35) / 250))
  const bmi = weight / (height / 100) ** 2

  return {
    calories,
    maintenance: Math.round(maintenance / 10) * 10,
    protein,
    carbs,
    fat,
    water,
    bmi: Math.round(bmi * 10) / 10,
  }
}
