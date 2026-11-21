# Technical Decisions

| Package | Version (installed) | Notes |
|---|---|---|
| next | 16.4.6 | App Router; `src/proxy.ts` for Supabase cookie refresh |
| react / react-dom | 19.1.0 | |
| tailwindcss | 4.x | `@import "tailwindcss"` + handoff `pt.css` |
| @supabase/ssr + supabase-js | latest | Cookie SSR; `getClaims()` for session |
| zod + react-hook-form | latest | Shared client/server validation |
| vitest | 3.2.4 | Unit tests |
| @playwright/test | latest | Viewport QA |
| @axe-core/playwright | 4.x | a11y scan |

Official docs referenced:

- https://nextjs.org/docs
- https://supabase.com/docs/guides/auth/server-side/nextjs
- https://tailwindcss.com/docs
- https://playwright.dev/docs/intro

Homepage markup is generated from `handoff/index.html` via `node scripts/extract-home.mjs` for pixel fidelity.
