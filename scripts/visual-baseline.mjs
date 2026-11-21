import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const outDir = path.join(root, "docs", "screenshots");
fs.mkdirSync(outDir, { recursive: true });

const handoff = pathToFileURL(path.join(root, "handoff", "index.html")).href;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

await page.goto(handoff, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({
  path: path.join(outDir, "baseline-handoff-1440.png"),
  fullPage: true,
});

await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({
  path: path.join(outDir, "next-home-1440.png"),
  fullPage: true,
});

// Section crops for comparison
const sections = ["top", "human", "how", "live", "anyone", "included", "pricing", "faq", "contact"];
for (const id of sections) {
  const el = page.locator(`#${id}`);
  if (await el.count()) {
    await el.screenshot({
      path: path.join(outDir, `next-section-${id}.png`),
    });
  }
}

console.log("Screenshots written to", outDir);
await browser.close();
