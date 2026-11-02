export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

export const FOOD_FIELDS = {
  calories: { label: 'Calories', unit: 'kcal', max: 5000, step: 1 },
  protein_g: { label: 'Protein', unit: 'g', max: 500, step: 0.1 },
  carbs_g: { label: 'Carbs', unit: 'g', max: 1000, step: 0.1 },
  fat_g: { label: 'Fat', unit: 'g', max: 500, step: 0.1 },
}

export const MEAL_PLANS = {
  bulk: {
    title: 'High-protein bulk day',
    meals: [
      { meal: 'breakfast', name: 'Oats with milk, banana and peanut butter', calories: 650, protein_g: 25, carbs_g: 90, fat_g: 20 },
      { meal: 'lunch', name: 'Chicken rice bowl with vegetables', calories: 750, protein_g: 50, carbs_g: 95, fat_g: 16 },
      { meal: 'snack', name: 'Greek yogurt with honey and almonds', calories: 350, protein_g: 22, carbs_g: 30, fat_g: 15 },
      { meal: 'dinner', name: 'Lentil or beef curry with two rotis and salad', calories: 800, protein_g: 45, carbs_g: 85, fat_g: 28 },
      { meal: 'snack', name: 'Glass of milk and two boiled eggs', calories: 300, protein_g: 22, carbs_g: 14, fat_g: 17 },
    ],
  },
  cut: {
    title: 'Lean cut day',
    meals: [
      { meal: 'breakfast', name: 'Egg white omelette with vegetables and one toast', calories: 300, protein_g: 28, carbs_g: 22, fat_g: 9 },
      { meal: 'lunch', name: 'Grilled chicken salad with chickpeas', calories: 450, protein_g: 45, carbs_g: 30, fat_g: 14 },
      { meal: 'snack', name: 'Greek yogurt with berries', calories: 180, protein_g: 18, carbs_g: 20, fat_g: 2 },
      { meal: 'dinner', name: 'Grilled fish with one roti and vegetables', calories: 500, protein_g: 42, carbs_g: 45, fat_g: 14 },
      { meal: 'snack', name: 'Apple and a handful of almonds', calories: 220, protein_g: 5, carbs_g: 25, fat_g: 12 },
    ],
  },
}

export const DEFAULT_WATER_TARGET = 8
