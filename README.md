# PHAZE

AI fitness web app with two phases: Bulk and Cut.

## Project structure

```
Fitness_Dual_Project/
├── docs/                     Project scope and documentation PDFs
├── frontend/                 React web app
│   ├── public/               Static files
│   └── src/
│       ├── assets/           Images and logo
│       ├── components/
│       │   ├── auth/         Login components
│       │   ├── common/       Reusable UI (Alert, Card, Logo, TextField...)
│       │   ├── dashboard/    Dashboard cards
│       │   ├── help/         Help and support topics
│       │   ├── history/      Workout history and summary
│       │   ├── notifications/ Notification list items
│       │   ├── nutrition/    Food log, meal plan and water
│       │   ├── onboarding/   Onboarding components
│       │   ├── profile/      Profile components
│       │   ├── progress/     Progress charts
│       │   ├── settings/     Settings cards
│       │   └── workouts/     Exercise library and workout session
│       ├── constants/        Fixed values and options
│       ├── context/          Auth, profile, notification and active workout state
│       ├── layouts/          Page layouts
│       ├── lib/              Supabase client and data functions
│       ├── pages/            App screens
│       ├── routes/           App routes
│       └── utils/            Helper functions
└── supabase/
    └── migrations/           Database SQL files
```

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Add your Supabase URL and publishable key to `.env`. Never put the secret key in the frontend.

The app runs at http://localhost:5173

## Database

Run the files in `supabase/migrations` in order, in the Supabase SQL Editor.

| File | Adds |
| --- | --- |
| `001_profiles.sql` | Profiles table and signup trigger |
| `002_username_and_signup.sql` | Usernames and signup checks |
| `003_profile_onboarding.sql` | Activity level and onboarding flag |
| `004_workouts_nutrition_water.sql` | Workouts, workout sets, food logs and water logs |
| `005_phase_notifications_settings.sql` | Phase start date, notifications and user settings |
