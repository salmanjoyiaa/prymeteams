"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  addFollowUpSchema,
  addLeadNoteSchema,
  completeFollowUpSchema,
  convertLeadSchema,
  deleteByIdSchema,
  formDataToObject,
  updateLeadSchema,
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

export async function updateLead(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = updateLeadSchema.safeParse({
    leadId: raw.leadId,
    fullName: raw.fullName,
    email: raw.email,
    companyName: raw.companyName,
    phone: raw.phone,
    website: raw.website,
    message: raw.message,
    planType: raw.planType || undefined,
    intent: raw.intent || undefined,
  });
  if (!parsed.success) return;

  await supabase
    .from("leads")
    .update({
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      company_name: parsed.data.companyName || null,
      phone: parsed.data.phone || null,
      website: parsed.data.website || null,
      message: parsed.data.message,
      ...(parsed.data.planType ? { plan_type: parsed.data.planType } : {}),
      ...(parsed.data.intent ? { intent: parsed.data.intent } : {}),
    })
    .eq("id", parsed.data.leadId);

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
}

export async function deleteLead(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  await supabase.from("leads").delete().eq("id", parsed.data.id);
  revalidatePath("/admin/leads");
}

export async function completeFollowUp(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = completeFollowUpSchema.safeParse({
    followUpId: formData.get("followUpId"),
    leadId: formData.get("leadId"),
    completed: formData.get("completed") ?? "true",
  });
  if (!parsed.success) return;

  await supabase
    .from("follow_ups")
    .update({ completed: parsed.data.completed })
    .eq("id", parsed.data.followUpId);

  revalidatePath(`/admin/leads/${parsed.data.leadId}`);
}

export async function deleteNote(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const noteId = String(formData.get("noteId") ?? "");
  const leadId = String(formData.get("leadId") ?? "");
  const parsed = deleteByIdSchema.safeParse({ id: noteId });
  if (!parsed.success || !leadId) return;

  await supabase.from("lead_notes").delete().eq("id", parsed.data.id);
  revalidatePath(`/admin/leads/${leadId}`);
}
