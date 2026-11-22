# Pryme Teams Website

Production website for **Pryme Teams** — dedicated Customer Success Experts (solo or full team), with a public marketing site and an authenticated admin CRM.

Visual source of truth: [`handoff/`](handoff/) (Handoff v2, including the floating call button and business-hours logic).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Supabase** (Auth + Postgres + RLS)
- **Vitest** · **Playwright** · deploy target: **Vercel**

## Preview

<video src="docs/demo/showcase.mp4" controls playsinline width="100%">
  Your browser does not support the video tag. Download
  <a href="docs/demo/showcase.mp4">showcase.mp4</a>
  or <a href="docs/demo/showcase.webm">showcase.webm</a>.
</video>

Product tour (~70–100s): homepage sections + hover moments, `/request`, `/talent`, and admin login. Re-record with `npm run record:showcase` (optionally set `ADMIN_EMAIL` / `ADMIN_PASSWORD` for full dashboard pages). **MP4** is best for README; WebM is the Playwright source.

## Features

| Area | What’s included |
|---|---|
| Homepage | Pixel-faithful handoff layout, live clock, mobile nav, **floating call FAB** with open / after-hours states (`?call=open` / `?call=after` to preview) |
| Lead intake | `/request` with Zod validation, honeypot, rate-limited RPC |
| Public talent | `/talent` from approved + visible profiles only |
| Admin | Leads, companies, talent, jobs, placements, tasks, finance, audit, site settings — create / edit / delete + **Seed demo dashboard** |
| AI (Groq) | Lead insight, job description expand, talent bio polish (`GROQ_API_KEY`) |
| Legal | `/privacy`, `/terms` placeholders |

## Quick start

```bash
npm install
# create .env.local with the variables below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site builds and renders **without** Supabase env vars (forms show a “not configured” state).

## Environment

Create a local `.env.local` (gitignored — never commit it):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon / publishable key |
| `SUPABASE_SECRET_KEY` | Service role JWT (server-only; needed for `npm run seed:demo`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap / SEO |
| `GROQ_API_KEY` | Groq API key for admin AI helpers |
| Turnstile keys | Optional bot protection (wire when ready) |

After first admin login, use **Settings → Seed demo dashboard** to load showcase CRM data (works with your admin session even without a service-role key).

## Database (SQL is not in this repo)

**SQL schema files are intentionally excluded from GitHub.** Keep `supabase/schema.sql` only on your machine or a private channel.

High-level setup:

1. Create a Supabase project.
2. Run your private schema SQL in the Supabase SQL Editor.
3. Create an admin in **Authentication → Users** (email + password).
4. Insert that user’s UUID into `public.admin_users`.
5. Sign in at `/admin/login` (also linked as **Admin** in the site footer).
6. Edit public placeholders at `/admin/settings`.

See [`docs/deployment.md`](docs/deployment.md) for the full checklist (no schema dump).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` / `npm start` | Production build & serve |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright viewport QA |
| `npm run seed:demo` | Seed demo CRM data via service-role key |
| `npm run record:showcase` | Record ~100s MP4/WebM tour into `docs/demo/` |
| `node scripts/extract-home.mjs` | Regenerate homepage from `handoff/index.html` |

## Security notes

- Admin routes require Supabase Auth + `admin_users` allowlist (and RLS `is_admin()`).
- Public lead writes go only through the `submit_lead` RPC (Zod + honeypot + hashed IP rate limit).
- Security headers (CSP, frame deny, nosniff, referrer policy) are set in `next.config.ts`.
- Logout requires same-origin POST; discovery URLs are scheme-allowlisted.
- Do not publish SQL, service-role keys, or real phone/email secrets to a public repo.

## Docs

- [`docs/deployment.md`](docs/deployment.md)
- [`docs/verification-log.md`](docs/verification-log.md)
- [`docs/decision-log.md`](docs/decision-log.md)
- [`handoff/README.md`](handoff/README.md) — design handoff notes (v2 call button)

## License

Private / proprietary — all rights reserved unless otherwise agreed.
