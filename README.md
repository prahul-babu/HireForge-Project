# HireForge

HireForge is a personal career workspace built with React and Vite. It can run in local-only mode, or it can connect to Supabase so your profile, resume analyses, and wellness entries persist in a hosted database.

## Features

- Resume analysis with local scoring, suggestions, roadmap, and interview prep
- Personal profile editor with local or Supabase-backed persistence
- Wellness tracker with saved daily check-ins
- Built-in assistant for resume and interview guidance
- Static frontend deployment on Vercel
- Optional Supabase database sync

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local` and add your Supabase values when you are ready to use the hosted database:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## Production build

```bash
npm run build
```

The generated `dist/` directory can be hosted on Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static hosting service. This repo also includes `vercel.json` so React Router routes work correctly on Vercel.

## Database setup

1. Create a Supabase project.
2. Open the SQL editor and run [supabase/schema.sql](/Users/p.rahulbabu/Documents/Codex/2026-04-19-https-faithful-hire-forge-flow-base44/supabase/schema.sql).
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to `.env.local` for local development.
4. Add those same variables in your Vercel project settings for production.

Without those env vars, HireForge falls back to browser local storage.

## Go live on Vercel

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. Set the two Supabase env vars in Vercel.
4. Deploy.

## Important note

The current Supabase setup is aimed at getting your personal app live quickly. For stronger privacy and multi-user security, the next upgrade would be adding real authentication and tightening the row-level security policies.
