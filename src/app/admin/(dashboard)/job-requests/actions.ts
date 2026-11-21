"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  addInterviewSchema,
  addShortlistSchema,
  createJobRequestSchema,
  formDataToObject,
} from "@/lib/validation/admin";

export async function createJobRequest(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createJobRequestSchema.safeParse({
    title: raw.title,
    description: raw.description,
    companyId: raw.companyId,
    status: raw.status || "open",
  });
  if (!parsed.success) return;

  const { data } = await supabase
    .from("job_requests")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description || null,
      company_id: parsed.data.companyId,
      status: parsed.data.status,
    })
    .select("id")
    .single();

  revalidatePath("/admin/job-requests");
  if (data?.id) revalidatePath(`/admin/job-requests/${data.id}`);
}

export async function addShortlist(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = addShortlistSchema.safeParse({
    jobRequestId: raw.jobRequestId,
    talentId: raw.talentId,
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("shortlists").insert({
    job_request_id: parsed.data.jobRequestId,
    talent_id: parsed.data.talentId,
    notes: parsed.data.notes || null,
  });

  revalidatePath(`/admin/job-requests/${parsed.data.jobRequestId}`);
}

export async function addInterview(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = addInterviewSchema.safeParse({
    jobRequestId: raw.jobRequestId,
    talentId: raw.talentId,
    scheduledAt: raw.scheduledAt,
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("interviews").insert({
    job_request_id: parsed.data.jobRequestId,
    talent_id: parsed.data.talentId,
    scheduled_at: parsed.data.scheduledAt,
    notes: parsed.data.notes || null,
  });

  revalidatePath(`/admin/job-requests/${parsed.data.jobRequestId}`);
}
