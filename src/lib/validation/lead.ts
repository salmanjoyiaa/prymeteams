import { z } from "zod";

export const PLAN_VALUES = ["solo", "team", "round_the_clock", "unset"] as const;
export const INTENT_VALUES = ["quote", "discovery", "question"] as const;

export const planFromQuery = (raw: string | null | undefined) => {
  if (!raw) return "unset" as const;
  const normalized = raw.replace(/-/g, "_");
  if (normalized === "solo" || normalized === "team" || normalized === "round_the_clock") {
    return normalized;
  }
  return "unset" as const;
};

export const intentFromQuery = (raw: string | null | undefined) => {
  if (!raw) return "quote" as const;
  if (raw === "discovery" || raw === "question" || raw === "quote") return raw;
  return "quote" as const;
};

export const leadFormSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(254),
  companyName: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  plan: z.enum(PLAN_VALUES),
  intent: z.enum(INTENT_VALUES),
  message: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(4000),
  websiteUrl: z.string().max(0).optional().or(z.literal("")), // honeypot
  formStartedAt: z.number().int().positive(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
