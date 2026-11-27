/**
 * Record a ~100s homepage + public product tour as MP4 for README.
 * Best format for GitHub README: H.264 MP4 (wide support).
 *
 * Usage:
 *   npm run build && npm run start
 *   npm run record:showcase
 *
 * Optional: ADMIN_EMAIL + ADMIN_PASSWORD in .env.local to include /admin screens.
 */
import { chromium } from "@playwright/test";
import { mkdirSync, existsSync, readdirSync, copyFileSync, statSync } from "fs";
import { join } from "path";

const BASE = process.env.SHOWCASE_BASE_URL || "http://localhost:3000";
const OUT_DIR = join(process.cwd(), "docs", "demo");
const RAW_DIR = join(OUT_DIR, ".playwright-video");

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(RAW_DIR, { recursive: true });

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: RAW_DIR, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  console.log("Recording showcase against", BASE);

  // Hero (~12s)
  await page.goto(`${BASE}/?call=open`, { waitUntil: "networkidle" });
  await sleep(3500);
  await page.mouse.move(720, 220);
  await sleep(600);
  await page.locator('a.pt-btn:has-text("Get a team")').first().hover().catch(() => {});
  await sleep(1200);
  await page.locator('a.pt-nav').nth(1).hover().catch(() => {});
  await sleep(900);
  await page.evaluate(() => window.scrollBy(0, 420));
  await sleep(2000);

  // Scroll sections (~48s)
  for (const id of ["#human", "#how", "#live", "#anyone", "#included", "#pricing", "#faq", "#contact"]) {
    await page.locator(id).scrollIntoViewIfNeeded().catch(() => {});
    await sleep(2800);
    if (id === "#included" || id === "#how") {
      const card = page.locator(`${id} .pt-card`).first();
      if (await card.count()) await card.hover().catch(() => {});
      await sleep(1400);
    }
    if (id === "#faq") {
      const closed = page.locator("#faq details.pt-faq:not([open]) summary").first();
      if (await closed.count()) {
        await closed.click().catch(() => {});
        await sleep(1600);
      }
    }
  }

  // Request form (~8s)
  await page.goto(`${BASE}/request`, { waitUntil: "networkidle" });
  await sleep(2800);
  await page.locator("input, textarea").first().hover().catch(() => {});
  await sleep(1500);

  // Talent (~6s)
  await page.goto(`${BASE}/talent`, { waitUntil: "networkidle" });
  await sleep(3200);

  // Admin (optional login) (~20s+)
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  await page.goto(`${BASE}/admin/login`, { waitUntil: "networkidle" });
  await sleep(2200);

  if (email && password) {
    await page.fill('input[type="email"], input[name="email"]', email).catch(() => {});
    await page.fill('input[type="password"], input[name="password"]', password).catch(() => {});
    await page.click('button[type="submit"]').catch(() => {});
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15000 }).catch(() => {});
    await sleep(2500);

    for (const path of [
      "/admin",
      "/admin/leads",
      "/admin/talent",
      "/admin/job-requests",
      "/admin/finance",
      "/admin/settings",
    ]) {
      await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" }).catch(() => {});
      await sleep(2600);
    }
  } else {
    console.log("Tip: set ADMIN_EMAIL + ADMIN_PASSWORD to include dashboard screens.");
    await sleep(3500);
  }

  // Back to hero finish (~5s)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await sleep(3500);

  await context.close();
  await browser.close();

  // Copy newest webm to docs/demo
  const files = readdirSync(RAW_DIR)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => join(RAW_DIR, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);

  if (!files.length) {
    console.error("No video produced");
    process.exit(1);
  }

  const webmOut = join(OUT_DIR, "showcase.webm");
  copyFileSync(files[0], webmOut);
  console.log("Wrote", webmOut);

  // Prefer MP4 for GitHub README when ffmpeg is available
  const mp4Out = join(OUT_DIR, "showcase.mp4");
  try {
    const { spawnSync } = await import("child_process");
    let ffmpegBin = "ffmpeg";
    try {
      const mod = await import("@ffmpeg-installer/ffmpeg");
      ffmpegBin = mod.path || mod.default?.path || ffmpegBin;
    } catch {
      /* system ffmpeg */
    }
    const res = spawnSync(
      ffmpegBin,
      [
        "-y",
        "-i",
        webmOut,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        "-an",
        mp4Out,
      ],
      { encoding: "utf8" },
    );
    if (res.status === 0 && existsSync(mp4Out)) {
      console.log("Wrote", mp4Out, "(recommended for README)");
    } else {
      console.log("ffmpeg convert failed — use showcase.webm in README");
      if (res.stderr) console.log(res.stderr.slice(-500));
    }
  } catch (e) {
    console.log("ffmpeg missing — keep showcase.webm", e?.message || "");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
