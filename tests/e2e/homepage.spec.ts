import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import fs from "node:fs";

test.describe("homepage", () => {
  test("renders key sections and CTAs", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Hire one. Hire a team.",
    );
    await expect(page.locator("#how")).toBeVisible();
    await expect(page.locator("#live")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();

    const buildTeam = page.getByRole("link", { name: /Build my team/i }).first();
    await expect(buildTeam).toHaveAttribute("href", "/request");

    const soloQuote = page.getByRole("link", { name: "Get my quote" }).first();
    await expect(soloQuote).toHaveAttribute("href", /plan=solo/);

    // No placeholder mailto
    const html = await page.content();
    expect(html).not.toContain("mailto:[YOUR EMAIL]");
    expect(html).not.toContain('href="#"');

    const shotDir = path.join(process.cwd(), "docs", "screenshots");
    fs.mkdirSync(shotDir, { recursive: true });
    const file = path.join(
      shotDir,
      `home-${testInfo.project.name}.png`,
    );
    await page.screenshot({ path: file, fullPage: true });
  });

  test("FAQ accordion works", async ({ page }) => {
    await page.goto("/#faq");
    const details = page.locator("#faq details").nth(1);
    await details.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
  });

  test("request plan preselect", async ({ page }) => {
    await page.goto("/request?plan=team");
    await expect(page.locator("#plan")).toHaveValue("team");
  });

  test("admin redirects when unauthenticated", async ({ page }) => {
    await page.goto("/admin/leads");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("axe scan on homepage", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    expect(results.violations.filter((v) => v.impact === "critical")).toEqual(
      [],
    );
  });
});
