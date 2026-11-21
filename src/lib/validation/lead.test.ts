import { describe, expect, it } from "vitest";
import {
  intentFromQuery,
  leadFormSchema,
  planFromQuery,
} from "./lead";
import { normalizeSettings, DEFAULT_PUBLIC_SITE } from "../settings";

describe("planFromQuery", () => {
  it("allowlists plans", () => {
    expect(planFromQuery("solo")).toBe("solo");
    expect(planFromQuery("team")).toBe("team");
    expect(planFromQuery("round-the-clock")).toBe("round_the_clock");
    expect(planFromQuery("hack")).toBe("unset");
  });
});

describe("intentFromQuery", () => {
  it("allowlists intents", () => {
    expect(intentFromQuery("discovery")).toBe("discovery");
    expect(intentFromQuery("question")).toBe("question");
    expect(intentFromQuery("nope")).toBe("quote");
  });
});

describe("leadFormSchema", () => {
  it("accepts valid payload", () => {
    const result = leadFormSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      companyName: "Analytical",
      phone: "",
      website: "",
      plan: "team",
      intent: "quote",
      message: "Need a dedicated CS team for support.",
      websiteUrl: "",
      formStartedAt: Date.now(),
    });
    expect(result.success).toBe(true);
  });

  it("rejects short message", () => {
    const result = leadFormSchema.safeParse({
      fullName: "Ada",
      email: "ada@example.com",
      plan: "solo",
      intent: "quote",
      message: "hi",
      formStartedAt: Date.now(),
    });
    expect(result.success).toBe(false);
  });
});

describe("normalizeSettings", () => {
  it("falls back to defaults", () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_PUBLIC_SITE);
  });
});
