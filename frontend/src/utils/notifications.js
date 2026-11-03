import { toDateKey } from './dates.js'

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]
const MEAL_REMINDER_HOUR = 11
const WORKOUT_REMINDER_HOUR = 12
const WATER_REMINDER_HOUR = 15

function getPhaseNotification(phase) {
  const phaseKey = `phase-${phase.name.toLowerCase()}-${toDateKey(phase.startedAt)}`

  if (phase.complete) {
    return {
      kind: 'progress',
      title: `${phase.name} phase complete`,
      body: `You finished all ${phase.totalWeeks} weeks. Restart the phase or switch goals in Settings.`,
      link: '/settings',
      dedupe_key: `${phaseKey}-complete`,
    }
  }

  return {
    kind: 'progress',
    title: phase.week === 1 ? `Your ${phase.name} phase has started` : `Week ${phase.week} of your ${phase.name} phase`,
    body: `Week ${phase.week} of ${phase.totalWeeks}. Follow today's plan and hit your daily targets.`,
    link: '/home',
    dedupe_key: `${phaseKey}-week-${phase.week}`,
  }
}

function getReminders({ today, hour, settings, plan, doneToday, totals, glasses, waterTarget, calorieTarget }) {
  const reminders = []

  if (settings.meal_reminders && hour >= MEAL_REMINDER_HOUR && totals.calories === 0) {
    reminders.push({
      kind: 'reminder',
      title: 'Log your meals',
      body: calorieTarget
        ? `Nothing logged yet today. Your target is ${calorieTarget.toLocaleString()} kcal.`
        : 'Nothing logged yet today.',
      link: '/nutrition',
      dedupe_key: `meal-${today}`,
    })
  }

  if (settings.workout_reminders && hour >= WORKOUT_REMINDER_HOUR && !doneToday) {
    reminders.push({
      kind: 'reminder',
      title: 'Time to train',
      body: `No workout logged today. Today's plan is ${plan.title}, about ${plan.minutes} minutes.`,
      link: '/workouts',
      dedupe_key: `workout-${today}`,
    })
  }

  if (settings.water_reminders && hour >= WATER_REMINDER_HOUR && glasses < waterTarget / 2) {
    reminders.push({
      kind: 'reminder',
      title: 'Drink some water',
      body: `${glasses} of ${waterTarget} glasses so far today.`,
      link: '/nutrition',
      dedupe_key: `water-${today}`,
    })
  }

  return reminders
}

export function buildNotifications(summary) {
  const notifications = getReminders(summary)

  if (summary.settings.progress_updates) {
    notifications.push(getPhaseNotification(summary.phase))

    if (STREAK_MILESTONES.includes(summary.streak)) {
      notifications.push({
        kind: 'progress',
        title: `${summary.streak}-day streak`,
        body: `You have trained ${summary.streak} days in a row. Keep it going.`,
        link: '/progress',
        dedupe_key: `streak-${summary.streak}-${summary.today}`,
      })
    }
  }

  return notifications
}
