# CareerCanvas

CareerCanvas is a self-hosted career workspace built with React and Vite. It stores profile data, resume analyses, wellness check-ins, and assistant context locally in the browser.

## Features

- Resume analysis with local scoring, suggestions, roadmap, and interview prep
- Personal profile editor with persistent local storage
- Wellness tracker with saved daily check-ins
- Built-in assistant for resume and interview guidance
- Static frontend deployment with no required backend

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The generated `dist/` directory can be hosted on Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static hosting service.

## Data model

This version stores app data in browser local storage. That makes it simple to self-host, but data is device-specific unless you later connect your own backend.

## Next upgrade path

If you want cloud sync, logins, or real model calls later, the UI is now cleanly separated so we can plug in your own backend and provider cleanly.
