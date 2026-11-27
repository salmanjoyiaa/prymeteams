"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createCompanySchema,
  deleteByIdSchema,
  formDataToObject,
  updateCompanySchema,
} from "@/lib/validation/admin";

export async function createCompany(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createCompanySchema.safeParse({
    name: raw.name,
    website: raw.website,
    industry: raw.industry,
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase.from("companies").insert({
    name: parsed.data.name,
    website: parsed.data.website || null,
    industry: parsed.data.industry || null,
    notes: parsed.data.notes || null,
  });

  revalidatePath("/admin/companies");
}

export async function updateCompany(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = updateCompanySchema.safeParse({
    companyId: raw.companyId,
    name: raw.name,
    website: raw.website,
    industry: raw.industry,
    notes: raw.notes,
  });
  if (!parsed.success) return;

  await supabase
    .from("companies")
    .update({
      name: parsed.data.name,
      website: parsed.data.website || null,
      industry: parsed.data.industry || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", parsed.data.companyId);

  revalidatePath("/admin/companies");
}

export async function deleteCompany(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = deleteByIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  await supabase.from("companies").delete().eq("id", parsed.data.id);
  revalidatePath("/admin/companies");
}
