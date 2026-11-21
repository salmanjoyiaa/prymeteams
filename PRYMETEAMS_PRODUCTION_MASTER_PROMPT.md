# PRYME TEAMS - PRODUCTION BUILD MASTER PROMPT

**Purpose:** A complete, execution-oriented prompt for an autonomous software-engineering LLM (Cursor Agent, Claude Code, Codex, or a comparable coding agent) to transform the approved Pryme Teams static website handoff into a production-grade Next.js application using Supabase and deployable to Vercel.

**Evidence base:** `Pryme-Teams-Website-Handoff.zip` (the latest approved website handoff), especially `pryme-teams-website/index.html`, `pryme-teams-website/README.md`, `pryme-teams-website/design-reference-full-page.png`, and all nine supplied brand assets. Optional secondary requirements: `PrymeTeams_MVP_SRD(2).md`. The previous `FLOWIQ_DESIGN_SPEC.md` is historical inspiration ONLY, not the current Pryme Teams design contract.

**Operating rule:** Read the complete prompt and provided project files. Then IMPLEMENT the application, not just a plan or a mockup. Your final answer must identify actual work completed, runnable commands, migrations, test results, deployment state, URLs (only if verified), and unresolved blockers. Do not claim success for any command, service, test, or deployment you did not execute.

---

## 0. YOUR ROLE AND MISSION

You are a combined Principal Frontend Engineer, Staff Full-Stack Engineer, Senior UI/UX Designer, Database Architect, Security Engineer, QA Automation Lead, and Vercel Release Engineer. The standard is a meticulously faithful premium brand site, hardened backend, maintainable TypeScript code, and reproducible deployment - not an attractive but nonfunctional prototype.

Build **Pryme Teams**, a managed service for dedicated Customer Success Experts, one person or a staffed team. The approved public site emphasizes: dedicated personnel, a 48-hour onboarding proposition, QA, SOPs, backups, sample live-visibility experiences, custom quote-based pricing, and a sales-led acquisition journey. The older SRD describes a broader managed virtual-assistant talent/CRM platform. Preserve the latest approved public positioning while implementing compatible backend workflows from the SRD.

**Non-negotiable quality gates:**

1. Preserve the supplied homepage's visual composition, exact copy (except unresolved placeholders and clearly unverified operational claims), 11-section order, branded illustration language, motion, and responsive intent.
2. Implement functional pathways for every visible actionable element: navigation, quote CTAs, discovery call CTA, pricing tier selection, FAQ, mobile menu, request form, and admin actions. No dead anchors or placeholder mailto links in a production release.
3. Use production-capable **Next.js App Router + React + strict TypeScript + Tailwind CSS + Supabase PostgreSQL/Auth + Vercel**, with minimal supporting libraries.
4. Persist real customer enquiries and operational state to Supabase. Do not create fake production analytics, sample live users, hardcoded lead counts, or dummy talent presented as real.
5. Perform automated tests plus browser-based visual and interaction QA at desktop, tablet, and mobile sizes. Run a production build and verify a Vercel preview before any production cutover.
6. Implement Row Level Security (RLS), server-only secrets, administrator access controls, input validation, anti-spam protection, and audited state-changing operations.
7. Preserve source assets and their licenses; never introduce stock people, invented testimonials, employer logos, purported actual camera footage, or unsupported prices.
8. Document verifiable results and remaining uncertainties. Credentials, DNS access, and account authorization are external dependencies; never invent them or bypass an approval requirement.

## 1. FIRST ACTIONS - INVENTORY, EVIDENCE, DECISIONS

Do this **before** replacing files or generating components:

1. Print working directory, git status, package manager, Node version, current dependency manifests, and a directory tree excluding build artifacts and secrets. Never overwrite uncommitted user work.
2. Locate and safely extract `Pryme-Teams-Website-Handoff.zip` if necessary. Read README and entire `index.html`; inspect all CSS, inline styles, DOM sections, anchors, JS, SVGs, image assets, metadata, and `design-reference-full-page.png`.
3. Open the HTML in an actual local browser and capture a baseline screenshot at **1440 x 900** with a full-page capture. Compare it to `design-reference-full-page.png` (**1440 x 10532** source image). Note any rendering differences caused by fonts, browser, or viewport. Do not assert the screenshot is a responsive design spec.
4. Open and read `PrymeTeams_MVP_SRD(2).md` if available; categorize its items into compatible product features, separate-site features, and conflicts.
5. Create `docs/source-audit.md`, `docs/requirements-traceability.md`, `docs/decision-log.md`, and `docs/verification-log.md`. Document each assertion as VERIFIED (source file or test), IMPLEMENTATION DECISION, or NEEDS BUSINESS CONFIRMATION.
6. Research the current stable supported API and security guidance using **official** Next.js, Supabase, Vercel, Tailwind, shadcn/ui, Playwright, and TypeScript documentation. Record installed/pinned package versions and cited official URLs in `docs/technical-decisions.md`. Avoid RC/canary releases and outdated APIs. Use Node LTS compatible with selected packages.
7. Establish priority: **latest handoff = binding visual and public-copy contract; the SRD = compatible backend requirements; previous FlowIQ = nonbinding inspiration**. If content or workflow requirements collide, preserve the handoff's exact landing-page appearance and implement the additional product functionality on appropriate separate routes without silently redesigning the homepage.
8. Make an implementation checklist, then execute it phase by phase. If business or account credentials are unavailable, complete all independently executable work and report the precise blocked step. Avoid stalling on broad questions.

### Important verified observations from the supplied handoff

- The archive is a **self-contained HTML/CSS page**, not a React/Next.js codebase. It has 14 archive entries: folders, `README.md`, `index.html`, a reference PNG, and nine assets.
- The current HTML has a single small JavaScript feature: a visitor-local camera-overlay clock (`#pt-clock`). The majority of visual animation uses CSS/SVG. There is **no functional database backend, request form, account system, admin dashboard, or payment integration**.
- The reference image is **1440 x 10532**. Reproduce its desktop section proportions instead of substituting a generic landing-page template.
- CTA links currently lead to `#contact`, and the discovery-call CTA uses `mailto:[YOUR EMAIL]`. Footer contains `[YOUR DOMAIN]`, `[YOUR EMAIL]`, `[OFFICE LOCATION]`, and an FAQ uses `[BUY-OUT TERMS]` per the handoff note. Treat these as blockers to fill with verified values, not license to invent details.
- The office/desk camera scenes are **illustrative sample visuals**, not authorized real camera streams. Label them unambiguously as demo/sample. Do not add a genuine streaming integration without explicit authorization, access-control design, legal/privacy review, and real streaming infrastructure.
- The README calls for mobile improvements below 768px. The source CSS defines **no dedicated mobile layout media query** other than reduced-motion settings. Responsive design must be implemented and tested rather than assumed.
- Exact public brand: dark midnight/navy background, emerald green conversion accent, controlled gold in the crowned-P brandmark, red as a semantic highlight, and Archivo + Inter typography. Do **not** replace this with FlowIQ lime, blue gradients, or a standard template.

## 2. PRODUCT-SCOPE RECONCILIATION

Maintain two explicit, compatible workstreams:

### A. APPROVED PUBLIC OFFER (the handoff; design must remain faithful)

- Pryme Teams provides **Dedicated Customer Success Experts**, one or multiple, in managed teams.
- Current copy: "Hire one. Hire a team. Never a headache.", "Hire someone with a heartbeat. Not a processor.", "Fully live in 48 hours.", "Don't trust us. Watch us.", "Anyone can hire. For anything. Literally.", "Everything's included. Except the stress.", "No packages. Just your price.", "Questions? Good.", and "Your customers are calling. Who's picking up?".
- Three quote-based service configurations: **Solo Expert**, **Dedicated Team**, **Round-the-Clock**. Price display is **Custom**, never fabricated monthly amounts.
- Operations claims (48 hours, camera access, SOPs, buy-out options, limited intake, QA) come from approved handoff copy, but validate with the business owner before treating these as contractual, guaranteed, or live capabilities. Preserve design even if copy later requires legal review.

### B. PRIOR MVP OPERATIONS SRD (supplied earlier; backend requirements)

- A managed agency, **not** a self-service freelancer marketplace; staff control vetting, matching, approval, placement, and account management.
- Public company request intake; private super-admin; CRM lead stages (New, Contacted, Qualified, Proposal Sent, Converted, Lost); companies; talent directory with approval and opt-in public visibility; shortlists/interviews/placements; tasks; basic financial tracking.
- The SRD calls for a public talent showcase, but the **approved homepage has no talent showcase**. Default resolution: deliver a designed `/talent` page with only approved data, accessible from a clearly scoped footer or contextual CTA, and keep the existing 11 homepage sections unchanged. Never insert unapproved talent cards into the pixel-matched homepage by default. Record this reconciliation.
- Rephrase "Request a VA" fields to fit the public offer, e.g. "Request a team" / "Get my quote", while preserving the underlying data capture needs. Do not silently present the company as an open freelancer marketplace.
- Do not build self-service client or talent login, AI hiring decisions, payroll, payment gateway, or multi-admin UI for this MVP.

### Delivery milestones

**P0 - production vertical slice (mandatory):** Approved homepage, responsive nav, exact imagery, working quote/request page and lead persistence, a secure super-admin login, admin lead list/detail/stage/notes/follow-ups, basic company records, a private talent-management module, approved public talent page, privacy/terms placeholders explicitly flagged for legal content, Vercel preview, and testing.

**P1 - complete operating MVP (complete after P0 if within project engagement, without degrading P0):** Job requests, shortlists, interviews, placements, task/activity timeline, admin KPI dashboard from real DB rows, lightweight contracts/invoices/payment status, and audit trail. Use the SRD field definitions. If P1 cannot be finished, ship an honestly scoped P0 and provide a clear P1 backlog; **never call a P0-only build the complete SRD MVP**.

Do not fill production with fabricated records. Development demo fixtures belong only in local/isolated test environments and must be distinguishable from live data.

## 3. RECOMMENDED IMPLEMENTATION STACK

Use the leanest **verified compatible** stable set. Verify exact package versions at build time; do not assume old APIs still exist:

| Concern | Preferred implementation | Why |
|---|---|---|
| Frontend/full-stack | Next.js App Router, React, strict TypeScript | Vercel-native SSR, Server Components, route handlers, SEO |
| Styling | Tailwind CSS v4-style integration + custom CSS variables; selectively retain `pt-` animation classes | Pixel-accurate design with minimal runtime CSS |
| Accessible primitives | shadcn/ui + Radix primitives only for forms, dialog/drawer, admin components | Controlled source code rather than shipping a giant UI bundle |
| Icons | Lucide React where the original source lacks suitable icons; preserve original SVG graphics | Consistent and tree-shakable |
| Forms/validation | React Hook Form + Zod (or a simpler standards-compliant equivalent), shared schemas with **server validation** | Typed error states, safe persistence |
| Database | Supabase PostgreSQL + SQL migrations | Relations, consistency, production hosting |
| Authentication | Supabase Auth for one controlled super-admin; `@supabase/ssr` for cookie-based auth | Standard Next.js SSR session handling |
| File storage | Supabase **private** Storage when needed; signed URLs only after authorization | Prevent sensitive documents leaking |
| Database types | Supabase CLI-generated TypeScript database types | Schema/API correctness |
| Unit/integration tests | Vitest and React Testing Library where valuable | Fast feedback for validators and UI |
| Browser tests | Playwright with real browser navigation and visual screenshots | QA at actual viewports, all clickable paths |
| Accessibility | axe-core/Playwright, keyboard/manual testing | Functional inclusive UX |
| Analytics | Vercel Web Analytics/Speed Insights or a lightweight privacy-aware alternative only if configured and consent compliant | Avoid unconfigured track scripts |
| Deployment | Vercel Node-compatible runtime + Git-integrated deploys | Preview environments and reliable release |

**Avoid by default:** a custom Node/Express server, Prisma/Drizzle layered on Supabase unless a measured reason exists, Redux, heavy UI kits, animation frameworks for CSS effects already in the handoff, large state managers, redundant API proxy layers, artificial AI/chatbot features, complex microservices, and frontend-only database secrets. Prefer server components, typed SQL migrations, and pure CSS where possible. Use a small animation library only if a concrete effect cannot be implemented accessibly and efficiently in CSS.

**Framework-specific caution:** With Next.js versions that use `proxy.ts` rather than `middleware.ts`, follow the **current official** Supabase SSR guide for cookie refresh. Use `getClaims()`/server verification as documented; never trust client session state as authorization. Proxy alone does not protect server functions, route handlers, or direct database access.

## 4. PIXEL-ACCURATE BRAND CONTRACT - DO NOT REDESIGN

### Verified palette

| Semantic token | Hex | Primary use |
|---|---|---|
| `--pt-bg` | `#07090F` | Overall page / background |
| `--pt-band` | `#0B0E18` | Alternating dark bands |
| `--pt-surface` | `#0F1320` | Cards, panels |
| `--pt-border` | `#1E2436` | Card stroke |
| `--pt-divider` | `#1A2030` | Section/header separator |
| `--pt-text` | `#EEF1F7` | Headline and body primary |
| `--pt-muted` | `#9AA3B5` | Supporting copy |
| `--pt-nav-text` | `#C3CADA` | Navigation |
| `--pt-accent` | `#2EE6A0` | Green buttons, icons, accent, glow |
| `--pt-accent-hover` | `#7AF2C4` | Text-link hover |
| `--pt-gold` | `#E8C45A` | Logo/wordmark only where present |
| `--pt-red` | `#FF5A5F` | Problem/AI contrast, status dot, "stress" |

**Typography:** Archivo headings `500, 600, 700, 800, 900` as used in the original source, major hero at weight 900; Inter body `400, 500, 600`. Use `next/font/google` when the version/build pipeline supports it. Preserve the visible wordmark: gold **PRYME**, white **TEAMS**, tiny uppercase "CUSTOMER SUCCESS EXPERTS" below. Use provided original logo files, not an AI-generated substitute.

**Desktop measurement reference:** Source page max-width `1240px`, horizontal padding `32px`, sticky header with `rgba(7,9,15,.78)` and `backdrop-filter: blur(14px)`, separator `#1A2030`. Major sections often use `padding: 120px 32px` in the source; match per-section source values rather than globally overriding them. Card backgrounds and borders use exact values above. Use the supplied full-page image to check relative proportions.

### Recommended root variables (match verified values; fine-tune measured spacing)

```css
:root {
  --pt-bg: #07090f;
  --pt-band: #0b0e18;
  --pt-surface: #0f1320;
  --pt-border: #1e2436;
  --pt-divider: #1a2030;
  --pt-text: #eef1f7;
  --pt-muted: #9aa3b5;
  --pt-nav-text: #c3cada;
  --pt-accent: #2ee6a0;
  --pt-accent-hover: #7af2c4;
  --pt-gold: #e8c45a;
  --pt-red: #ff5a5f;
  --pt-container: 1240px;
  --pt-page-padding: 32px;
  --pt-header-blur: 14px;
  --pt-radius-card: 18px; /* verify each element: not all cards are 18px */
  --pt-focus-ring: 0 0 0 3px #2ee6a0;
}
html { scroll-behavior: smooth; }
body { background: var(--pt-bg); color: var(--pt-text); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

These are **starting tokens**, not permission to replace source-level dimensions. Inspect the original inline styles for exact border radii, padding, letter spacing, gradients, and responsive behavior. Preserve `pt-` class animations where practical; refactor gradually while screenshot-testing after each change.

### Visual implementation rules

- Dark luxury-tech aesthetic, not glossy generic AI/SaaS. Controlled green glow, subtle network lines, deliberate whitespace, exact black/navy contrast, restrained gold only in brand logo.
- Preserve real provided logos in `/public/brand/` (or `/public/assets/`) with unchanged transparency and geometry. Keep transparent logo files optimized, specify intrinsic dimensions, and supply correct alt text.
- Retain sophisticated animated SVG/HTML dashboard and camera **illustrations** from source. Do not replace with random icons, stock photography, generic chart cards, or screenshots from another product.
- Use compositional React components to preserve source SVG animation class behavior, IDs, and clipping paths. Scope SVG IDs per component instance if multiple instances are rendered to avoid clashes.
- Preserve headings and key copy exactly by default. Any changes needed for legal truthfulness, accessibility, or clear sample labels must be logged in `docs/content-review.md`.
- Keep animation cheap: transforms/opacity on small elements, noninteractive decorative SVG as presentation-only, throttled/reduced motion, no canvas/three.js unless justified.

## 5. APPROVED HOMEPAGE - SECTION-BY-SECTION ACCEPTANCE

Keep this **exact order and semantic story**. Split into modular React components without changing spacing/visual hierarchy.

| # | Section / ID | Design and content mandate | Functional contract |
|---|---|---|---|
| 1 | Sticky header | Frosted dark nav, crowned-P logo, gold/white wordmark, "How it works", "Live view", "What you get", "Pricing", "FAQ", watch-live and green get-a-team CTA | Correct anchors and active focus; adaptive accessible mobile menu; main CTA leads to request funnel |
| 2 | Hero `#top` | Badge, huge "Hire one. Hire a team. Never a headache." with green/red accented underline, network background, paragraph, two CTAs, floating "Your team - Live now" dashboard | Build-my-team opens `/request`; "See the live view" scrolls to `#live`; dashboard displays **sample** UI, never faux operational live data |
| 3 | Services ticker | Horizontal looping ribbon for calls, live chat/email, follow-up, back-office, SOPs, training, QA, camera access, etc. | Decorative; accessible paused/reduced-motion handling |
| 4 | Human vs AI `#human` | Two opposing dark cards: AI red/problem, "A Pryme expert" green/heartbeat; animated ECG/flatline | Informational; no invented interactive claims |
| 5 | How it works `#how` | "Fully live in 48 hours." two-column content with three timeline cards (Hour 0, Within 24 hours, By hour 48) | Semantic steps; focus/reveal do not hide content |
| 6 | Live view `#live` | "Don't trust us. Watch us." stylized office floor with camera HUD plus three desk camera cards, blinking status indicators, scanlines, time overlay | Preserve **sample illustration disclaimer**; time means visitor local time, not CCTV proof; watch-live anchor is real and accessible |
| 7 | Anyone can hire `#anyone` | Headline, bright green vertically scrolling task display, three business/individual/unusual cards | Loop can be paused or disabled by reduced motion; all text accessible |
| 8 | What you get `#included` | Eight feature cards, six in grid and two wider bottom cards: dedicated people, SOPs, training, backups, QA, camera, lead, tools | Responsive grids without text truncation |
| 9 | Commitments | "We don't overbook. We over-deliver." and "Love your team? Make them yours." contrasting dark/green cards | Terms and claims flagged for verification without silently deleting the section |
| 10 | Pricing `#pricing` | Three cards: Solo Expert, Dedicated Team (green featured), Round-the-Clock; **Custom** price labels and feature bullets | Each "Get my quote" CTA routes to `/request?plan=solo`, `?plan=team`, or `?plan=round-the-clock` and preselects corresponding form value |
| 11 | FAQ `#faq` | "Questions? Good." and **10** native `<details>` accordion items | Keyboard accessible open/close, stable focus, optional one-open behavior only if source-compatible, no broken disclosure state |
| 12 | Contact `#contact` | Large emerald block "Your customers are calling. Who's picking up?" with dark discovery CTA and contact line | Book-a-discovery link opens actual configured flow: default `/request?intent=discovery`; verified email if provided; no `mailto:[YOUR EMAIL]` |
| 13 | Footer | Brand lockup, company anchor links, contact info, copyright | Live links only, accurate domain/email/office location, policy links to real pages before launch |

**Note on counting:** The archive has **11 `<section>` elements**. The header, ticker, CTA, and footer are listed individually here as UI compositions; that is why the breakdown has 13 rows. Do not mistake this enumeration for an instruction to add extra homepage sections.

### Required interaction mapping

- Home wordmark -> `/#top`.
- "How it works" -> `/#how`.
- "Live view" and "Watch live" -> `/#live` (the **sample-view** section).
- "What you get" -> `/#included`.
- "Pricing" -> `/#pricing`.
- "FAQ" -> `/#faq`.
- "Get a team", "Build my team" -> `/request` (same label/style as original).
- "See the live view" -> `/#live`.
- Pricing CTAs -> `/request?plan=<allowlisted plan>`.
- "Ask us directly" and "Book a discovery call" -> `/request?intent=question` or `/request?intent=discovery`; preserve correct display text.
- Optional footer "Talent" -> `/talent`, only if implementing SRD P0, without expanding original nav unless required by a documented product decision.
- FAQ summary elements remain keyboard activated. Do not attach click handlers that break the native `<details>` behavior.
- No buttons with `href="#"`, `onClick={() => {}}`, `javascript:void(0)`, or routes that show blank pages.

## 6. RESPONSIVE DESIGN - MANDATORY BROWSER QA

Target actual tested viewports:

| Profile | Dimensions | Acceptance criteria |
|---|---|---|
| Desktop source | **1440 x 900** | Screenshot matches original composition; fixed header, hero typography/dashboard, 1240px max layout, precise gradients |
| Laptop | **1366 x 768** | Same hierarchy without collisions/overflow, comfortable hero and dashboard spacing |
| Tablet portrait | **768 x 1024** | Two-to-one-column adaptations, no cropped text, nav works, camera grid adapts |
| Mobile | **390 x 844** | Single-column reading, headline scales fluidly, nav drawer, touch targets >=44px, zero horizontal overflow |
| Small mobile | **320 x 700** | Useful additional stress test (optional, strongly recommended) |

Implement responsive typography using source-inspired `clamp()` rather than fixed 104px mobile headings. At <=767px prefer a real hamburger and accessible disclosure/drawer; do not allow wrapped desktop nav links to collide with CTAs. Test horizontal overflow, text scaling at 200%, viewport resize, sticky nav anchoring with `scroll-margin-top`, safe-area padding, touch/hover distinctions, and page stability without JS.

**Image/reference rule:** The provided long screenshot documents the desktop only. Mobile/tablet layouts must be a thoughtful extension and labeled as implementation decisions, not claimed to be source-verified.

## 7. MOTION SPECIFICATION - REPRODUCE THE ACTUAL CSS, NOT A GENERIC LIBRARY DEMO

Read actual source definitions (names, durations, easing, delays). Preserve equivalent result where accessible and performant:

| Effect | Verified source behavior | Implementation guidance |
|---|---|---|
| Hero rise | `ptRise`: opacity 0 to 1, translateY(36px) to 0; `.9s` custom cubic bezier; stagger `.1/.25/.4/.55/.75s` | CSS load motion; preserve exact hierarchy |
| Underline sweep | `ptSweep`: green/red emphasized text underline fills horizontally over `1s` after `1s` | CSS background size animation |
| Network flow | `ptFlow`: dashed SVG stroke with 2s linear loop; `ptNode`: 3s opacity pulse | Keep decorative SVG; reduce or pause on reduced-motion |
| Floating hero | `ptFloat`: 6s ease-in-out with -10px peak | CSS on dashboard container; do not cause layout shifts |
| CTA hover | `.pt-btn:hover`: translateY(-2px), emerald glow (14px/34px/-10px) | Add equivalent keyboard `focus-visible` visibility; no jump in layout |
| Card hover | `.pt-card:hover`: translateY(-4px) and accented border in `.3s` | Don't misrepresent a non-clickable card as interactive |
| Nav underline | `.pt-nav::after`: scaleX(0) to 1 in `.25s` | Maintain hover and focus behavior |
| Ticker | `ptMarquee`: translateX(0 -> -50%) over 36s infinite linear | Seamless duplicates with aria-hidden duplicates; pause semantics |
| Tasks list | `ptUp`: vertical translateY(-50%) 22s linear infinite | Seamless and reduced-motion alternative |
| Shift bars | `ptFill`: scaleX(0 -> 1) in 1.6s after 1s | Avoid claiming operational status |
| REC dots | `ptRec`: blink over 1.4s stepped; `ptScan`: scanline over 5s | Sample/demo badge must remain visible |
| ECG | `ptEcg`: 2.6s linear stroke animation; `ptBeat`: 1.3s | CSS/SVG; decorative visuals hidden from screen readers as appropriate |
| Camera figures | `ptSway` 3.2s, `ptNod` 4s, `ptTap` .32s, `ptScroll` 8s, `ptSteam` 2.4s, `ptBars` .7s, `ptWalk` 16s, `ptFlicker` 5s | Retain source SVG nodes/classes; avoid video replacement without real footage |
| Scroll reveal | `.pt-reveal` guarded by `@supports(animation-timeline: view())` | Preserve fallback: content remains visible if unsupported |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables animations/transitions | Preserve stronger, full-site accessibility behavior |

No speculative parallax and no extra entrance motions on every card. Test animation under real Chrome and reduced-motion conditions; inspect CPU cost and CLS. A CSS-only page should not be rewritten with GSAP/Framer Motion for aesthetics alone.

---
