import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { groqComplete } from "@/lib/ai/groq";

export const runtime = "nodejs";

type Body = {
  kind?: string;
  payload?: Record<string, string>;
};

async function assertAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub as string | undefined;
  if (!userId) return null;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return admin ? supabase : null;
}

export async function POST(req: Request) {
  const supabase = await assertAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const kind = body.kind;
  const p = body.payload ?? {};

  let system = "";
  let user = "";

  if (kind === "lead_insight") {
    system =
      "You are a B2B staffing CRM assistant for Pryme Teams (Customer Success Experts). Be concise, practical, and specific. Use short bullets.";
    user = `Analyze this inbound lead and return:
1) 3-bullet summary
2) Recommended next stage (one of: new, contacted, qualified, proposal_sent, converted, lost) with one-line why
3) A short reply email draft (under 120 words)

Lead:
Name: ${p.fullName || "—"}
Email: ${p.email || "—"}
Company: ${p.companyName || "—"}
Phone: ${p.phone || "—"}
Plan: ${p.planType || "—"}
Intent: ${p.intent || "—"}
Stage: ${p.stage || "—"}
Message:
${p.message || "—"}`;
  } else if (kind === "job_description") {
    system =
      "You write clear, professional job descriptions for Customer Success / support staffing roles. Output plain text only.";
    user = `Expand this brief into a polished job description (role overview, responsibilities, requirements, nice-to-haves). Keep it under 280 words.

Title: ${p.title || "Customer Success Expert"}
Brief / notes:
${p.description || p.brief || "Dedicated CS expert for client support."}
Company context: ${p.companyName || "client business"}`;
  } else if (kind === "talent_bio") {
    system =
      "You polish talent bios for a Customer Success Expert roster. Warm, credible, no fluff. Output the bio only.";
    user = `Rewrite this into a strong public bio (80–140 words).

Name: ${p.displayName || "Expert"}
Title: ${p.title || "Customer Success Expert"}
Skills: ${p.skills || "customer success"}
Draft bio:
${p.bio || "Experienced customer success professional."}`;
  } else {
    return NextResponse.json({ error: "Unknown AI kind" }, { status: 400 });
  }

  const result = await groqComplete(system, user);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  return NextResponse.json({ text: result.text });
}
