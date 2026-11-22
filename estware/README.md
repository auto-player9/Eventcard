# Estware website

The Estware studio site (home + services), built with Next.js 15 (App Router) and TypeScript.

## Run it

```bash
cd estware
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

- `app/page.tsx` – home: hero, what we build, our work (Syncly, EventCard), how we work, contact
- `app/services/page.tsx` – services and products
- `app/api/contact/route.ts` – contact form endpoint
- `components/` – header, footer, animated lion hero, icons, product sections, contact form
- `lib/site.ts` – email address, product links and the "What do you need?" options
- `app/globals.css` – all styles (light and dark mode)

## Contact form

Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` to have messages emailed to `CONTACT_TO`.
Without a key, the form opens the visitor's email app with the message filled in.

## Deploying on Vercel

Import the repo and set **Root Directory** to `estware`.
