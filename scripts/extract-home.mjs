/**
 * Extracts handoff/index.html body into a React TSX homepage fragment
 * with production CTA remaps and settings placeholders.
 *
 * Handoff v2: keeps pt-if / data-tel / call FAB markup; injects CallController.
 * Footer always includes Talent, Privacy, Terms, Admin after FAQ.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "handoff", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (!styleMatch) throw new Error("No <style> block found");
const cssOut = path.join(root, "src", "styles", "pt.css");
fs.mkdirSync(path.dirname(cssOut), { recursive: true });
const tokens = `
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
  --pt-focus-ring: 0 0 0 3px #2ee6a0;
}
`;
const cssBody = styleMatch[1]
  .replace(/pt-if\{display:contents\}/g, "[data-pt-if]{display:contents}")
  .replace(/pt-if\[hidden\]\{display:none\}/g, "[data-pt-if][hidden]{display:none}");
fs.writeFileSync(cssOut, tokens + cssBody + "\n");

let body = html
  .split("<body>")[1]
  .split("</body>")[0]
  .replace(/<script>[\s\S]*?<\/script>/g, "");

// Remap CTAs for production funnel
body = body
  .replace(/href="#contact"/g, 'href="/request"')
  .replace(
    /href="mailto:\[YOUR EMAIL\]"/g,
    'href="/request?intent=discovery"',
  );

// Specific pricing plan links — replace Get my quote anchors in order
const planHrefs = [
  "/request?plan=solo",
  "/request?plan=team",
  "/request?plan=round-the-clock",
];
let planIdx = 0;
body = body.replace(
  /<a href="\/request" class="pt-btn"([^>]*)>(Get my quote(?: →)?)<\/a>/g,
  (_m, attrs, label) => {
    const href = planHrefs[planIdx++] ?? "/request";
    return `<a href="${href}" class="pt-btn"${attrs}>${label}</a>`;
  },
);

body = body.replace(
  /Can't find yours\? <a href="\/request"/,
  'Can\'t find yours? <a href="/request?intent=question"',
);

// Settings placeholders as React expressions
body = body
  .replace(/Or email \[YOUR EMAIL\]/g, "Or email {settings.contactEmail}")
  .replace(/\[BUY-OUT TERMS\]/g, "{settings.buyOutTerms}")
  .replace(
    /<span style="color: #C3CADA">\[YOUR DOMAIN\]<\/span>/g,
    '<span style="color: #C3CADA">{settings.domain}</span>',
  )
  .replace(
    /<span style="color: #C3CADA">\[YOUR EMAIL\]<\/span>/g,
    '<span style="color: #C3CADA">{settings.contactEmail}</span>',
  )
  .replace(
    /<span style="color: #C3CADA">\[OFFICE LOCATION\]<\/span>/g,
    '<span style="color: #C3CADA">{settings.officeLocation}</span>',
  );

// Footer extras (Talent, legal, Admin) — after FAQ in COMPANY column
body = body.replace(
  /(<a href="#faq"[^>]*>FAQ<\/a>)(<\/div>\s*<div[^>]*>\s*<span[^>]*>CONTACT)/,
  `$1<a href="/talent" style="color: #C3CADA; text-decoration: none">Talent</a><a href="/privacy" style="color: #C3CADA; text-decoration: none">Privacy</a><a href="/terms" style="color: #C3CADA; text-decoration: none">Terms</a><a href="/admin/login" style="color: #C3CADA; text-decoration: none">Admin</a>$2`,
);

// Live clock
body = body.replace(
  /<span id="pt-clock">--:--:--<\/span>/,
  "<LiveClock />",
);

// Inject MobileNav after desktop CTA cluster (before </nav>)
body = body.replace(
  /(<\/div>\s*)(<\/nav>)/,
  `$1<MobileNav />\n$2`,
);

// Convert HTML attributes to JSX
function toJsx(fragment) {
  let s = fragment;
  s = s.replace(/\sclass=/g, " className=");
  s = s.replace(/\sopen=""/g, " open");
  s = s.replace(/<(img|br|hr|input|meta|link)([^>]*?)(?<!\/)>/gi, "<$1$2 />");
  const svgAttrs = [
    ["stroke-width", "strokeWidth"],
    ["stroke-opacity", "strokeOpacity"],
    ["stroke-dasharray", "strokeDasharray"],
    ["stroke-dashoffset", "strokeDashoffset"],
    ["stroke-linecap", "strokeLinecap"],
    ["stroke-linejoin", "strokeLinejoin"],
    ["fill-opacity", "fillOpacity"],
    ["fill-rule", "fillRule"],
    ["clip-path", "clipPath"],
    ["font-family", "fontFamily"],
    ["font-weight", "fontWeight"],
    ["font-size", "fontSize"],
    ["text-anchor", "textAnchor"],
    ["stop-color", "stopColor"],
    ["stop-opacity", "stopOpacity"],
    ["xlink:href", "xlinkHref"],
    ["xml:space", "xmlSpace"],
  ];
  for (const [from, to] of svgAttrs) {
    const re = new RegExp(`\\s${from}=`, "g");
    s = s.replace(re, ` ${to}=`);
  }
  s = s.replace(/\sstyle="([^"]*)"/g, (_m, css) => {
    const obj = {};
    css.split(";").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      const colon = trimmed.indexOf(":");
      if (colon === -1) return;
      const key = trimmed.slice(0, colon).trim();
      const val = trimmed.slice(colon + 1).trim();
      const camel = key.startsWith("--")
        ? key
        : key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      obj[camel] = val;
    });
    const entries = Object.entries(obj)
      .map(([k, v]) => {
        const keyOut =
          k.startsWith("--") || !/^[a-zA-Z_$][\w$]*$/.test(k)
            ? `"${k}"`
            : k;
        return `${keyOut}: ${JSON.stringify(v)}`;
      })
      .join(", ");
    return ` style={{${entries}}}`;
  });

  s = s.replace(/&amp;/g, "&");
  return s;
}

let jsxBody = toJsx(body);

// Custom element → span for React/TS; CallController still keys off data-when
jsxBody = jsxBody
  .replace(/<pt-if\b/g, "<span data-pt-if")
  .replace(/<\/pt-if>/g, "</span>");

// Root style uses CSS variables — cast for TS
jsxBody = jsxBody.replace(
  /<div style=\{\{("--accent": "#2EE6A0",[\s\S]*?)\}\}>/,
  '<div style={{$1} as CSSProperties}>',
);

jsxBody = `${jsxBody}\n<CallController config={settings.call} />\n`;

const tsx = `/* AUTO-GENERATED from handoff/index.html — do not hand-edit markup blindly.
 * Re-run: node scripts/extract-home.mjs
 * Preserves: Admin footer link, MobileNav, CallController (handoff v2 call FAB).
 */
import type { CSSProperties } from "react";
import type { PublicSiteBundle } from "@/lib/settings";
import { LiveClock } from "@/components/home/LiveClock";
import { MobileNav } from "@/components/home/MobileNav";
import { CallController } from "@/components/home/CallController";

export function HomePage({ settings }: { settings: PublicSiteBundle }) {
  return (
    <>
${jsxBody}
    </>
  );
}
`;

const outPath = path.join(root, "src", "components", "home", "HomePage.tsx");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, tsx);
console.log("Wrote", outPath);
console.log("Wrote", cssOut);
console.log("Plan CTA remaps:", planIdx);
