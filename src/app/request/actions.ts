"use server";

import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { leadFormSchema } from "@/lib/validation/lead";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getClientIp } from "@/lib/client-ip";

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitLeadAction(
  input: unknown,
): Promise<SubmitLeadResult> {
  const parsed = leadFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  // Honeypot
  if (data.websiteUrl) {
    return { ok: true };
  }

  // Soft timing check (client-controlled — honeypot + DB rate limit are primary).
  if (Date.now() - data.formStartedAt < 2500) {
    return { ok: false, error: "Please take a moment and try again." };
  }

  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error:
        "Lead intake is not connected yet. Supabase environment variables are missing.",
    };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const ipHash = createHash("sha256").update(ip).digest("hex");

  // Use anon/publishable client — submit_lead is SECURITY DEFINER + granted to anon.
  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, error: "Unable to reach the database." };
  }

  const { error } = await supabase.rpc("submit_lead", {
    p_full_name: data.fullName,
    p_email: data.email,
    p_company_name: data.companyName || null,
    p_phone: data.phone || null,
    p_website: data.website || null,
    p_plan: data.plan,
    p_intent: data.intent,
    p_message: data.message,
    p_ip_hash: ipHash,
    p_source: "website",
  });

  if (error) {
    return {
      ok: false,
      error: error.message.includes("rate")
        ? "Too many requests. Please try again later."
        : "Could not save your request. Please try again.",
    };
  }

  return { ok: true };
}
