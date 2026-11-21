# Pryme Teams Website

Production website for **Pryme Teams** — dedicated Customer Success Experts (solo or full team), with a public marketing site and an authenticated admin CRM.

Visual source of truth: [`handoff/`](handoff/) (Handoff v2, including the floating call button and business-hours logic).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Supabase** (Auth + Postgres + RLS)
- **Vitest** · **Playwright** · deploy target: **Vercel**

## Features

| Area | What’s included |
|---|---|
| Homepage | Pixel-faithful handoff layout, live clock, mobile nav, **floating call FAB** with open / after-hours states (`?call=open` / `?call=after` to preview) |
| Lead intake | `/request` with Zod validation, honeypot, rate-limited RPC |
| Public talent | `/talent` from approved + visible profiles only |
| Admin | Leads, companies, talent, jobs, placements, tasks, finance, audit, site settings |
| Legal | `/privacy`, `/terms` placeholders |

## Quick start

```bash
npm install
cp .env.example .env.local   # fill when you have Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site builds and renders **without** Supabase env vars (forms show a “not configured” state).

## Environment

Copy [`.env.example`](.env.example):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Anon / publishable key |
| `SUPABASE_SECRET_KEY` | Service role (server-only; optional for most public flows) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for sitemap / SEO |
| Turnstile keys | Optional bot protection (wire when ready) |

Never commit `.env.local` or real secrets.

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
