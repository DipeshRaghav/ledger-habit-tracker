# The Ledger — multi-user habit tracker

React + Supabase (auth + database) + Vercel. You and your girlfriend each sign in with
your own Google account and only ever see your own habits.

## 1. Create a Supabase project

1. Go to https://supabase.com, sign up/in, and create a new project (free tier is enough).
2. Wait for it to finish provisioning.
Raghav@9899408919

## 2. Set up the database

1. In your Supabase project, open **SQL Editor**.
2. Paste the contents of `supabase/schema.sql` and run it. This creates the `habits`
   and `entries` tables with row-level security, so each user can only read/write their
   own rows.

## 3. Turn on Google sign-in

1. In Supabase: **Authentication → Providers → Google** → toggle it on.
2. You'll need a Google OAuth Client ID/Secret. Get one at
   https://console.cloud.google.com/apis/credentials:
   - Create an OAuth 2.0 Client ID ("Web application").
   - Add this as an **Authorized redirect URI** (Supabase shows you the exact value
     on the same Providers page — it looks like
     `https://<your-project-ref>.supabase.co/auth/v1/callback`).
   - Copy the generated Client ID and Client Secret back into Supabase's Google
     provider settings and save. 797024225007-for296pm09dphtgqqa61gvf6bvab4k63.apps.googleusercontent.com
3. In **Authentication → URL Configuration**, add your site URLs (e.g.
   `http://localhost:5173` for local dev, and your Vercel URL once deployed) under
   **Redirect URLs**.

## 4. Connect the app to your project

1. In Supabase: **Project Settings → API** — copy the **Project URL** and the
   **anon public key**.
2. Copy `.env.example` to `.env` and fill both in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

## 5. Run it locally

```bash
npm install
npm run dev
```

Open the printed localhost URL, sign in with Google, and add a habit.

## 6. Deploy to Vercel

1. Push this project to your GitHub repo (or a new one).
2. In Vercel: **New Project** → import the repo. Framework preset: **Vite**.
3. Add the same two environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in Vercel's project settings.
4. Deploy. Once it's live, add the Vercel URL to Supabase's **Redirect URLs**
   (step 3.3 above) or Google sign-in will fail on the deployed site.

## How multi-user works

- Each habit and each day's entry is tagged with `user_id` (set automatically from
  the signed-in Google account).
- Row-level security policies in `schema.sql` mean the database itself refuses to
  return or modify another user's rows — it's not just hidden in the UI, it's
  enforced by Postgres.
- You and your girlfriend can both open the same URL, each sign in with your own
  Google account, and you'll always see only your own habits.
