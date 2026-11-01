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
│       │   ├── onboarding/   Onboarding components
│       │   └── profile/      Profile components
│       ├── constants/        Fixed values and options
│       ├── context/          Auth and profile state
│       ├── data/             Sample dashboard data
│       ├── layouts/          Page layouts
│       ├── lib/              Supabase client
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
