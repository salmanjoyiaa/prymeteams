"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createCompanySchema, formDataToObject } from "@/lib/validation/admin";

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
