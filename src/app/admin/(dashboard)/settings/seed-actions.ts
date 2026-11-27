"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

const IDS = {
  co1: "a1111111-1111-4111-8111-111111111101",
  co2: "a1111111-1111-4111-8111-111111111102",
  co3: "a1111111-1111-4111-8111-111111111103",
  lead1: "b2222222-2222-4222-8222-222222222201",
  lead2: "b2222222-2222-4222-8222-222222222202",
  lead3: "b2222222-2222-4222-8222-222222222203",
  lead4: "b2222222-2222-4222-8222-222222222204",
  lead5: "b2222222-2222-4222-8222-222222222205",
  t1: "c3333333-3333-4333-8333-333333333301",
  t2: "c3333333-3333-4333-8333-333333333302",
  t3: "c3333333-3333-4333-8333-333333333303",
  t4: "c3333333-3333-4333-8333-333333333304",
  job1: "d4444444-4444-4444-8444-444444444401",
  job2: "d4444444-4444-4444-8444-444444444402",
  place1: "e5555555-5555-4555-8555-555555555501",
  task1: "f6666666-6666-4666-8666-666666666601",
  task2: "f6666666-6666-4666-8666-666666666602",
  contract1: "a7777777-7777-4777-8777-777777777701",
  invoice1: "a8888888-8888-4888-8888-888888888801",
  payment1: "a9999999-9999-4999-8999-999999999901",
};

export async function seedDemoData(): Promise<void> {
  const { supabase } = await requireAdmin();

  await supabase.from("companies").upsert(
    [
      {
        id: IDS.co1,
        name: "Northwind Retail",
        website: "https://northwind.example",
        industry: "E-commerce",
        notes: "DEMO_SEED · Peak season CS coverage",
      },
      {
        id: IDS.co2,
        name: "BrightPath Clinics",
        website: "https://brightpath.example",
        industry: "Healthcare",
        notes: "DEMO_SEED · Appointment + billing support",
      },
      {
        id: IDS.co3,
        name: "Orbit SaaS",
        website: "https://orbit.example",
        industry: "Software",
        notes: "DEMO_SEED · Onboarding + renewals",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("leads").upsert(
    [
      {
        id: IDS.lead1,
        full_name: "Alex Rivera",
        email: "alex@coastalbrands.example",
        company_name: "Coastal Brands",
        phone: "+1-555-0201",
        website: "https://coastal.example",
        plan_type: "team",
        intent: "discovery",
        message:
          "We need a dedicated CS team for US hours — chat + email. Live camera access is a must.",
        stage: "new",
        source: "website",
      },
      {
        id: IDS.lead2,
        full_name: "Priya Nair",
        email: "priya@helio.example",
        company_name: "Helio Fitness",
        phone: "+1-555-0202",
        plan_type: "solo",
        intent: "quote",
        message:
          "Looking for one expert for membership renewals and booking changes.",
        stage: "contacted",
        source: "website",
      },
      {
        id: IDS.lead3,
        full_name: "Sam Okonkwo",
        email: "sam@ledgerly.example",
        company_name: "Ledgerly",
        plan_type: "round_the_clock",
        intent: "quote",
        message: "24/7 coverage for billing questions across APAC + US.",
        stage: "qualified",
        source: "website",
      },
      {
        id: IDS.lead4,
        full_name: "Maya Chen",
        email: "maya@northwind.example",
        company_name: "Northwind Retail",
        plan_type: "team",
        intent: "discovery",
        message: "Expanding to evening shift — proposal requested.",
        stage: "proposal_sent",
        source: "website",
        company_id: IDS.co1,
      },
      {
        id: IDS.lead5,
        full_name: "Chris Park",
        email: "chris@orbit.example",
        company_name: "Orbit SaaS",
        plan_type: "solo",
        intent: "discovery",
        message: "Converted — onboarded solo expert for onboarding calls.",
        stage: "converted",
        source: "website",
        company_id: IDS.co3,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("talent").upsert(
    [
      {
        id: IDS.t1,
        display_name: "Aisha Rahman",
        title: "Senior Customer Success Expert",
        bio: "Calm under pressure with 6 years in retail CX. Owns email + live chat with crisp SOPs.",
        skills: ["Zendesk", "Live chat", "QA", "Retail"],
        years_experience: 6,
        status: "active",
        approved: true,
        public_visible: true,
        internal_notes: "DEMO_SEED",
      },
      {
        id: IDS.t2,
        display_name: "Diego Morales",
        title: "Customer Success Expert",
        bio: "Bilingual (EN/ES) specialist for booking changes and membership renewals.",
        skills: ["Intercom", "Spanish", "Bookings"],
        years_experience: 4,
        status: "active",
        approved: true,
        public_visible: true,
        internal_notes: "DEMO_SEED",
      },
      {
        id: IDS.t3,
        display_name: "Nora Patel",
        title: "Team Lead · CS",
        bio: "Leads multi-shift squads with QA coaching and client reporting.",
        skills: ["Team lead", "QA", "Reporting", "Salesforce"],
        years_experience: 8,
        status: "active",
        approved: true,
        public_visible: true,
        internal_notes: "DEMO_SEED",
      },
      {
        id: IDS.t4,
        display_name: "Kenji Sato",
        title: "Customer Success Expert",
        bio: "Night-shift specialist for SaaS onboarding and billing questions.",
        skills: ["Night shift", "SaaS", "Billing"],
        years_experience: 3,
        status: "draft",
        approved: false,
        public_visible: false,
        internal_notes: "DEMO_SEED",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("job_requests").upsert(
    [
      {
        id: IDS.job1,
        company_id: IDS.co1,
        title: "Evening CS team (3 experts)",
        description:
          "Cover 2pm–10pm ET chat + email for peak retail season. QA included.",
        status: "shortlisting",
      },
      {
        id: IDS.job2,
        company_id: IDS.co3,
        title: "Solo onboarding expert",
        description: "Handle new-user onboarding calls and help docs triage.",
        status: "interviewing",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("shortlists").upsert(
    [
      {
        id: "d1515151-1515-4151-8151-151515151501",
        job_request_id: IDS.job1,
        talent_id: IDS.t1,
        notes: "Strong retail fit",
      },
      {
        id: "d1515151-1515-4151-8151-151515151502",
        job_request_id: IDS.job1,
        talent_id: IDS.t2,
        notes: "Bilingual coverage",
      },
      {
        id: "d1515151-1515-4151-8151-151515151503",
        job_request_id: IDS.job2,
        talent_id: IDS.t3,
        notes: "Lead option",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("interviews").upsert(
    [
      {
        id: "d1616161-1616-4161-8161-161616161601",
        job_request_id: IDS.job2,
        talent_id: IDS.t1,
        scheduled_at: new Date(Date.now() + 3 * 86400000).toISOString(),
        notes: "DEMO_SEED · Client panel",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("placements").upsert(
    [
      {
        id: IDS.place1,
        company_id: IDS.co3,
        talent_id: IDS.t2,
        job_request_id: IDS.job2,
        status: "active",
        start_date: "2026-10-01",
        notes: "DEMO_SEED · Live placement",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("tasks").upsert(
    [
      {
        id: IDS.task1,
        title: "Send Northwind evening-shift proposal",
        description: "DEMO_SEED",
        status: "open",
        due_at: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: IDS.task2,
        title: "QA review · Orbit week 1",
        description: "DEMO_SEED",
        status: "in_progress",
        due_at: new Date(Date.now() + 2 * 86400000).toISOString(),
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("contracts").upsert(
    [
      {
        id: IDS.contract1,
        company_id: IDS.co3,
        placement_id: IDS.place1,
        title: "Orbit SaaS · Solo Expert · Q4",
        status: "active",
        notes: "DEMO_SEED",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("invoices").upsert(
    [
      {
        id: IDS.invoice1,
        company_id: IDS.co3,
        contract_id: IDS.contract1,
        amount_cents: 420000,
        currency: "USD",
        status: "sent",
        notes: "DEMO_SEED · November retainer",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("payments").upsert(
    [
      {
        id: IDS.payment1,
        invoice_id: IDS.invoice1,
        amount_cents: 420000,
        status: "pending",
        notes: "DEMO_SEED",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("lead_notes").upsert(
    [
      {
        id: "b1212121-1212-4121-8121-121212121211",
        lead_id: IDS.lead2,
        body: "DEMO_SEED · Sent intro deck and asked for hours/tools.",
      },
      {
        id: "b1212121-1212-4121-8121-121212121212",
        lead_id: IDS.lead3,
        body: "DEMO_SEED · Confirmed Zendesk + Intercom stack.",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("follow_ups").upsert(
    [
      {
        id: "b1313131-1313-4131-8131-131313131301",
        lead_id: IDS.lead1,
        due_at: new Date(Date.now() + 86400000).toISOString(),
        note: "DEMO_SEED · Discovery call",
        completed: false,
      },
      {
        id: "b1313131-1313-4131-8131-131313131302",
        lead_id: IDS.lead4,
        due_at: new Date(Date.now() + 2 * 86400000).toISOString(),
        note: "DEMO_SEED · Send revised quote",
        completed: false,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("activities").upsert(
    [
      {
        id: "aa101010-1010-4101-8101-101010101001",
        entity_type: "lead",
        entity_id: IDS.lead2,
        summary: "DEMO_SEED · Outreach email sent",
      },
      {
        id: "aa101010-1010-4101-8101-101010101002",
        entity_type: "placement",
        entity_id: IDS.place1,
        summary: "DEMO_SEED · Placement marked active",
      },
    ],
    { onConflict: "id" },
  );

  await supabase
    .from("site_settings")
    .update({
      contact_email: "zach@prymeteams.co",
      domain: "prymeteams.com",
      office_location: "Remote-first · US + PK delivery hubs",
      buy_out_terms:
        "Team buy-out available after 6 months of continuous placement; terms quoted per role.",
      phone: "+1 (555) 014-2000",
      after_phone: "+1 (555) 014-2099",
      hours_label: "Mon–Fri · 9am–6pm ET",
    })
    .eq("id", 1);

  for (const path of [
    "/admin",
    "/admin/leads",
    "/admin/companies",
    "/admin/talent",
    "/admin/job-requests",
    "/admin/placements",
    "/admin/tasks",
    "/admin/finance",
    "/admin/settings",
    "/talent",
  ]) {
    revalidatePath(path);
  }

  redirect("/admin/settings?saved=seed");
}
