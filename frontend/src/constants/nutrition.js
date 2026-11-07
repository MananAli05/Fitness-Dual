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

export const MEAL_PLAN_WEEK = {
  bulk: [
    [
      { meal: 'breakfast', items: [['paratha', 1], ['omelette', 1], ['chai', 1]] },
      { meal: 'lunch', items: [['chicken-biryani', 1], ['raita', 1]] },
      { meal: 'snack', items: [['banana', 2], ['peanut-butter', 1], ['milk', 1]] },
      { meal: 'dinner', items: [['chicken-karahi', 1], ['roti', 3], ['salad', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['oats', 1], ['milk', 1], ['banana', 1], ['almonds', 1]] },
      { meal: 'lunch', items: [['daal', 1], ['rice', 1], ['chicken-tikka', 1]] },
      { meal: 'snack', items: [['lassi', 1], ['dates', 1]] },
      { meal: 'dinner', items: [['beef-qeema', 1], ['roti', 3], ['raita', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['boiled-egg', 3], ['paratha', 1], ['chai', 1]] },
      { meal: 'lunch', items: [['chana', 1], ['rice', 1], ['dahi', 1]] },
      { meal: 'snack', items: [['mango-shake', 1], ['almonds', 1]] },
      { meal: 'dinner', items: [['grilled-chicken', 1], ['roti', 2], ['mixed-sabzi', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['omelette', 1], ['roti', 2], ['chai', 1]] },
      { meal: 'lunch', items: [['nihari', 1], ['naan', 1]] },
      { meal: 'snack', items: [['whey', 1], ['banana', 1], ['milk', 1]] },
      { meal: 'dinner', items: [['daal', 1], ['rice', 1], ['chicken-tikka', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['oats', 1], ['milk', 1], ['peanut-butter', 1], ['banana', 1]] },
      { meal: 'lunch', items: [['chicken-karahi', 1], ['roti', 2]] },
      { meal: 'snack', items: [['channa-chaat', 1], ['lassi', 1]] },
      { meal: 'dinner', items: [['fish', 1], ['rice', 1], ['salad', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['puri', 2], ['chana', 1], ['chai', 1]] },
      { meal: 'lunch', items: [['chicken-biryani', 1], ['raita', 1]] },
      { meal: 'snack', items: [['almonds', 1], ['dates', 1], ['milk', 1]] },
      { meal: 'dinner', items: [['mutton-curry', 1], ['roti', 2], ['salad', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['paratha', 1], ['boiled-egg', 2], ['dahi', 1]] },
      { meal: 'lunch', items: [['haleem', 1], ['naan', 1]] },
      { meal: 'snack', items: [['whey', 1], ['banana', 1], ['peanut-butter', 1]] },
      { meal: 'dinner', items: [['grilled-chicken', 1], ['rice', 1], ['mixed-sabzi', 1]] },
    ],
  ],
  cut: [
    [
      { meal: 'breakfast', items: [['omelette', 1], ['roti', 1], ['green-tea', 1]] },
      { meal: 'lunch', items: [['grilled-chicken', 1], ['salad', 1], ['dahi', 1]] },
      { meal: 'snack', items: [['apple', 1], ['almonds', 1]] },
      { meal: 'dinner', items: [['daal', 1], ['roti', 1], ['mixed-sabzi', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['oats', 1], ['boiled-egg', 2]] },
      { meal: 'lunch', items: [['chicken-tikka', 1], ['roti', 1], ['salad', 1]] },
      { meal: 'snack', items: [['fruit-chaat', 1]] },
      { meal: 'dinner', items: [['fish', 1], ['mixed-sabzi', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['boiled-egg', 3], ['bread', 1], ['green-tea', 1]] },
      { meal: 'lunch', items: [['chana', 1], ['salad', 1], ['dahi', 1]] },
      { meal: 'snack', items: [['whey', 1], ['apple', 1]] },
      { meal: 'dinner', items: [['chicken-karahi', 1], ['roti', 1], ['salad', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['dahi', 1], ['banana', 1], ['almonds', 1]] },
      { meal: 'lunch', items: [['grilled-chicken', 1], ['rice', 1]] },
      { meal: 'snack', items: [['green-tea', 1], ['dates', 1]] },
      { meal: 'dinner', items: [['palak', 1], ['roti', 1], ['chicken-tikka', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['omelette', 1], ['bread', 1], ['green-tea', 1]] },
      { meal: 'lunch', items: [['daal', 1], ['rice', 1], ['salad', 1]] },
      { meal: 'snack', items: [['channa-chaat', 1]] },
      { meal: 'dinner', items: [['grilled-chicken', 1], ['mixed-sabzi', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['oats', 1], ['milk', 1]] },
      { meal: 'lunch', items: [['fish', 1], ['roti', 1], ['salad', 1]] },
      { meal: 'snack', items: [['whey', 1], ['apple', 1]] },
      { meal: 'dinner', items: [['beef-qeema', 1], ['roti', 1], ['raita', 1]] },
    ],
    [
      { meal: 'breakfast', items: [['boiled-egg', 2], ['roti', 1], ['chai', 1]] },
      { meal: 'lunch', items: [['chicken-tikka', 1], ['chana', 1]] },
      { meal: 'snack', items: [['fruit-chaat', 1]] },
      { meal: 'dinner', items: [['daal', 1], ['mixed-sabzi', 1], ['roti', 1]] },
    ],
  ],
}

export const ADJUSTABLE_FOODS = ['roti', 'paratha', 'naan', 'puri', 'bread', 'rice', 'oats']

export const DEFAULT_WATER_TARGET = 8
