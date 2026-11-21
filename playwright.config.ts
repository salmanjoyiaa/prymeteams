import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3000",
    trace: "on-first-retry",
    browserName: "chromium",
  },
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop-1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "laptop-1366", use: { viewport: { width: 1366, height: 768 } } },
    { name: "tablet-768", use: { viewport: { width: 768, height: 1024 } } },
    {
      name: "mobile-390",
      use: { viewport: { width: 390, height: 844 }, isMobile: true },
    },
    {
      name: "mobile-320",
      use: { viewport: { width: 320, height: 700 }, isMobile: true },
    },
  ],
});
