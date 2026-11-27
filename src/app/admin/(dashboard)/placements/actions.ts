"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createPlacementSchema,
  deleteByIdSchema,
  formDataToObject,
  updatePlacementStatusSchema,
} from "@/lib/validation/admin";

export async function createPlacement(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createPlacementSchema.safeParse({
    companyId: raw.companyId,
    talentId: raw.talentId,
    jobRequestId: raw.jobRequestId,
    status: raw.status || "pending",
    startDate: raw.startDate,
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("placements").insert({
    company_id: parsed.data.companyId,
    talent_id: parsed.data.talentId,
    job_request_id: parsed.data.jobRequestId,
    status: parsed.data.status,
    start_date: parsed.data.startDate || null,
    notes: parsed.data.notes || null,
  });

  revalidatePath("/admin/placements");
}

export async function updatePlacementStatus(
  formData: FormData,
): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = updatePlacementStatusSchema.safeParse({
    placementId: formData.get("placementId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await supabase
    .from("placements")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.placementId);

  revalidatePath("/admin/placements");
}

export async function deletePlacement(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  await supabase.from("placements").delete().eq("id", parsed.data.id);
  revalidatePath("/admin/placements");
}
