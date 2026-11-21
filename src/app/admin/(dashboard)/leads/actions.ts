"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  addFollowUpSchema,
  addLeadNoteSchema,
  convertLeadSchema,
  formDataToObject,
  updateLeadStageSchema,
} from "@/lib/validation/admin";

export async function updateStage(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();
  const parsed = updateLeadStageSchema.safeParse({
    leadId: formData.get("leadId"),
    stage: formData.get("stage"),
  });
  if (!parsed.success) return;

  await supabase
    .from("leads")
    .update({ stage: parsed.data.stage })
    .eq("id", parsed.data.leadId);

  await supabase.from("activities").insert({
    entity_type: "lead",
    entity_id: parsed.data.leadId,
    summary: `Stage updated to ${parsed.data.stage}`,
    created_by: userId,
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
}

export async function addNote(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();
  const parsed = addLeadNoteSchema.safeParse({
    leadId: formData.get("leadId"),
    body: formData.get("body"),
  });
  if (!parsed.success) return;

  await supabase.from("lead_notes").insert({
    lead_id: parsed.data.leadId,
    body: parsed.data.body,
    created_by: userId,
  });

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
}

export async function addFollowUp(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = addFollowUpSchema.safeParse({
    leadId: raw.leadId,
    dueAt: raw.dueAt,
    note: raw.note ?? raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("follow_ups").insert({
    lead_id: parsed.data.leadId,
    due_at: parsed.data.dueAt,
    note: parsed.data.note || null,
    created_by: userId,
  });

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
}

export async function convertLead(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = convertLeadSchema.safeParse({
    leadId: formData.get("leadId"),
  });
  if (!parsed.success) return;

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", parsed.data.leadId)
    .maybeSingle();

  if (!lead || lead.company_id) return;

  const companyName =
    lead.company_name?.trim() || `${lead.full_name.trim()} (from lead)`;

  const { data: company } = await supabase
    .from("companies")
    .insert({
      name: companyName,
      website: lead.website,
      notes: `Converted from lead ${lead.id}`,
    })
    .select("id")
    .single();

  if (!company) return;

  await supabase.from("contacts").insert({
    company_id: company.id,
    full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    role: "Primary contact",
  });

  await supabase
    .from("leads")
    .update({
      stage: "converted",
      company_id: company.id,
    })
    .eq("id", lead.id);

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${lead.id}`);
  revalidatePath("/admin/companies");
}
