export const HELP_SECTIONS = [
  {
    title: 'Phases and targets',
    topics: [
      {
        question: 'How are my calorie and protein targets calculated?',
        answer:
          'We estimate your maintenance calories from your age, height, weight, gender and daily activity. Bulk adds 300 kcal and Cut removes 500 kcal. Protein is 1.8 g per kg of body weight on Bulk and 2.2 g per kg on Cut.',
      },
      {
        question: 'How do I switch between Bulk and Cut?',
        answer:
          'Open Profile, pick the other phase and save. Your targets update right away and the new phase starts from week 1.',
      },
      {
        question: 'How long is a phase?',
        answer:
          'Bulk runs for 12 weeks and Cut for 10 weeks. When a phase is complete you can restart it from Settings or switch to the other phase.',
      },
    ],
  },
  {
    title: 'Workouts',
    topics: [
      {
        question: 'How do I log a workout?',
        answer:
          'Go to Workouts and start today\'s plan or an empty workout. Enter your reps, seconds or weight, tap Log on each set you complete, then tap Finish workout. At least one set must be logged.',
      },
      {
        question: 'What happens if I close the app during a workout?',
        answer:
          'Your workout in progress is kept on this device. Open Workouts or the dashboard and choose Resume workout to continue.',
      },
      {
        question: 'How is my streak counted?',
        answer:
          'Your streak is the number of days in a row with at least one finished workout. If you have not trained yet today, the streak counts up to yesterday.',
      },
    ],
  },
  {
    title: 'Nutrition and water',
    topics: [
      {
        question: 'How do I log food and water?',
        answer:
          'Open Nutrition, pick the meal and search for your food, for example roti or daal. Choose how much you ate and tap Add. If your food is not in the list, enter it yourself. You can also tap Log on a meal from the daily meal plan. Use the arrows at the top to see earlier days, and Add glass to track water (one glass is 250 ml).',
      },
      {
        question: 'Can I remove a food I logged by mistake?',
        answer: 'Yes. Open Nutrition and remove the entry from today\'s food log. Your totals update right away.',
      },
    ],
  },
  {
    title: 'Account and notifications',
    topics: [
      {
        question: 'Why am I getting reminders?',
        answer:
          'Reminders are based on your own logs, for example when no food is logged by late morning. You can turn each type of reminder on or off in Settings.',
      },
      {
        question: 'How do I change my password?',
        answer:
          'Open Settings and use Change password. If you are logged out, use Forgot password on the login screen to get a reset link by email.',
      },
      {
        question: 'Who can see my data?',
        answer:
          'Your profile, workouts, food and water logs are linked to your account, and the database only lets you read and change your own data.',
      },
    ],
  },
]

export const HELP_LINKS = [
  { label: 'Start a workout', to: '/workouts' },
  { label: 'Log food and water', to: '/nutrition' },
  { label: 'Edit profile and phase', to: '/profile' },
  { label: 'Notification settings', to: '/settings' },
]
