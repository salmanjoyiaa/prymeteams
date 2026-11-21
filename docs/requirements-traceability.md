# Requirements Traceability

| Requirement | Source | Delivery |
|---|---|---|
| Pixel-faithful homepage | Handoff + reference PNG | `/` components + `pt.css` |
| Working quote funnel | Prompt P0 | `/request` + `submit_lead` RPC |
| Super-admin + leads CRM | Prompt P0 | `/admin/*` |
| Talent admin + public `/talent` | Prompt P0 | tables + pages |
| Site settings placeholders | User decision | `site_settings` + `/admin/settings` |
| Job requests / shortlists / interviews / placements | Prompt P1 | admin modules |
| Tasks / activities / finance / audit | Prompt P1 | admin modules |
| RLS + anti-spam | Prompt §3/§0 | schema + server validation |
| Tests + Vercel preview | Prompt P0 | Vitest, Playwright, Vercel MCP |
