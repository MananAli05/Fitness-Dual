export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Prefer not to say' },
]

export const ACTIVITY_LEVELS = [
  { value: 'low', label: 'Low', hint: 'Desk job, little walking' },
  { value: 'moderate', label: 'Moderate', hint: 'On your feet part of the day' },
  { value: 'high', label: 'High', hint: 'Physical job or very active' },
]

export const FITNESS_LEVELS = [
  { value: 'beginner', label: 'Beginner', hint: 'New to training, or back after a long break' },
  { value: 'intermediate', label: 'Intermediate', hint: 'Training regularly for 6+ months' },
  { value: 'advanced', label: 'Advanced', hint: 'Several years of consistent training' },
]

export const GOALS = [
  { value: 'bulk', label: 'Build muscle', hint: '01 — Bulk phase' },
  { value: 'cut', label: 'Lose fat', hint: '02 — Cut phase' },
]

export const NUMBER_FIELDS = {
  age: { label: 'Age', unit: 'years', min: 13, max: 100, step: 1, placeholder: '24' },
  height_cm: { label: 'Height', unit: 'cm', min: 120, max: 230, step: 0.5, placeholder: '175' },
  weight_kg: { label: 'Weight', unit: 'kg', min: 30, max: 250, step: 0.1, placeholder: '70' },
}
