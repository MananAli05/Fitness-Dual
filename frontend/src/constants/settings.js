export const NOTIFICATION_SETTINGS = [
  {
    key: 'workout_reminders',
    label: 'Workout reminders',
    hint: 'After midday, if you have not logged a workout yet.',
  },
  {
    key: 'meal_reminders',
    label: 'Meal reminders',
    hint: 'Late morning, if you have not logged any food yet.',
  },
  {
    key: 'water_reminders',
    label: 'Water reminders',
    hint: 'Mid afternoon, if you are below half of your water target.',
  },
  {
    key: 'progress_updates',
    label: 'Progress updates',
    hint: 'New phase weeks, finished phases and workout streaks.',
  },
]

export const DEFAULT_SETTINGS = {
  workout_reminders: true,
  meal_reminders: true,
  water_reminders: true,
  progress_updates: true,
}
