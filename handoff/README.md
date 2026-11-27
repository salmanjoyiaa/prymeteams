# Pryme Teams — Website Handoff

This pack contains the approved homepage design for **Pryme Teams** (dedicated Customer Success Experts). The goal is to build the live site to look and behave **exactly** like `index.html`.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | **The design, fully working.** One self-contained page (HTML + CSS + a tiny JS clock). Open it in Chrome to see every section, animation and hover state. Use it as the source of truth. |
| `design-reference-full-page.png` | Full-page screenshot at 1440px wide, for side-by-side comparison. |
| `assets/pryme-logo-full-on-dark.png` | Full lockup (green PRYME + TEAMS + tagline) on black. |
| `assets/pryme-logo-header.png` | Compact header/footer lockup. |
| `assets/pryme-logo-full-on-light.png` | Same lockup (dark-first brand). |
| `assets/pryme-icon-1024.png`, `-512.png`, `-180.png` | App / social / Apple touch icons. |
| `assets/pryme-favicon.svg`, `pryme-favicon-32.png` | Browser tab icons. |

## Brand

**Colors**

| Role | Hex |
|---|---|
| Page background | `#07090F` |
| Section band background | `#0B0E18` |
| Card surface | `#0F1320` |
| Card border | `#1E2436` |
| Text (primary) | `#EEF1F7` |
| Text (muted) | `#9AA3B5` |
| **Accent / logo green** (buttons, PRYME lockup) | `#2EE6A0` |
| **Red** ("headache", "Except the stress", AI card, LIVE badges) | `#FF5A5F` |

**Fonts** (Google Fonts, free)
- Headings: **Archivo** — 800 (ExtraBold), main headline 900 (Black)
- Body: **Inter** — 400 / 500 / 600

**Wordmark:** stacked lockup — green **PRYME**, cream **TEAMS**, muted tagline “CUSTOMER SUCCESS EXPERTS”.

## Page structure (top to bottom)

1. **Sticky header** — glass/blur bar, logo + wordmark, links (How it works, Live view, What you get, Pricing, FAQ), "● Watch live" and "Get a team →" buttons.
2. **Hero** (`#top`) — badge, headline "Hire one. Hire a team. Never a headache.", CTAs, animated network background, animated "Your team · Live now" dashboard.
3. **Scrolling ticker** of services.
4. **Human vs AI** (`#human`) — "Hire someone with a heartbeat. Not a processor."
5. **How it works** (`#how`) — "Fully live in 48 hours", 3 timed steps.
6. **Live view** (`#live`) — animated office-floor camera + 3 desk cameras.
7. **Anyone can hire** (`#anyone`) — scrolling task list + 3 cards.
8. **What you get** (`#included`) — 8 feature cards + Limited intake / Team buy-out cards.
9. **Pricing** (`#pricing`) — 3 "Custom" plans.
10. **FAQ** (`#faq`) — native `<details>` accordions (first: "customer support vs customer success").
11. **Contact CTA** (`#contact`) with email + call buttons, and **footer**.
12. **Floating call button** (bottom-right) — opens a small call card on click.

## Call button (business hours vs after hours)

The floating phone button (bottom-right) opens a card when clicked; the ✕ closes it. The card and the call buttons in the Contact section switch automatically based on the time in the business time zone:

| | During business hours | After hours |
|---|---|---|
| Status | ● WE'RE OPEN (green) | ● AFTER HOURS (gold) |
| Headline | Talk to a real human. | Can't sleep? Neither can we. Let's talk business. |
| Sub-line | No bots, no phone menus. + hours | A real person will pick up. |
| Button | Call [main number] | Call [after-hours number] |
| Secret password | "Guess what? I hate pineapple on pizza too." | "I think Ross and Rachel were on a break." |

**All settings are in one place** — the `PRYME_CALL` object at the bottom of `index.html` (phone numbers, hours label, time zone, opening/closing hour, weekends). On phones the buttons dial directly (`tel:` links).

**To preview each state** add `?call=open` or `?call=after` to the URL.

In the markup, `<pt-if data-when="open|after|popup-open|popup-closed">` wraps the parts that show/hide; the small script toggles them. Feel free to re-implement this in your framework of choice — the behaviour is what matters.

## Animations & interactions (all pure CSS unless noted)

- Hero text rises in on load; underline sweeps under "Never a headache."
- Network background: SVG lines with flowing dashes + pulsing nodes (hero); faint tiled network pattern behind the whole page.
- Pulsing status dots, blinking red REC/LIVE dots, floating dashboard, filling shift bars, typing dots.
- Heartbeat (ECG) line + beating heart icon in the human card; flat line + blinking cursor in the AI card.
- Animated camera scenes: typing hands, head nods, scrolling screens, coffee steam, sound bars, a person walking past, scan line + flicker.
- **Live clock** on the office camera and the **call button logic** — the only JavaScript (bottom of `index.html`).
- Horizontal service ticker and vertical "Your expert can handle" list loop forever.
- Cards fade/rise in on scroll using CSS scroll-driven animations (`animation-timeline: view()`), with graceful fallback in browsers that don't support it (cards simply show).
- Hover: buttons lift with a green glow, cards lift with a green border, nav links get a sliding green underline.
- All motion is disabled for visitors with "reduce motion" turned on (`prefers-reduced-motion`).

## Responsive

The layout uses flex-wrap and fluid widths, so it already reflows on tablet and phone. Please check below 768px: the very large headings (64–104px) should scale down (e.g. with `clamp()`), and the header links may need a hamburger menu on phones.

## Still to fill in / decide

- `[PHONE NUMBER]`, `[AFTER-HOURS NUMBER]`, hours and time zone — set in `PRYME_CALL` (see Call button above).
- `[YOUR EMAIL]` — used in the "Book a discovery call" buttons (currently `mailto:` links). Consider a booking form or Calendly instead.
- `[YOUR DOMAIN]`, `[OFFICE LOCATION]`, `[BUY-OUT TERMS]` in the footer and FAQ.
- **Camera visuals are illustrations**, labelled "Sample view". Replace with real office footage (a short looping muted `<video>`) when available.
- Add analytics, SEO meta / Open Graph image, privacy policy and terms pages.

## Notes for the build

- Copy the CSS from the `<style>` block as-is; class names are prefixed `pt-`.
- Most styling is inline on purpose (it came from the design tool) — feel free to move it into classes/components, but keep the values identical.
- No frameworks or external libraries are required.
