"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createTalentSchema,
  formDataToObject,
  toggleTalentSchema,
} from "@/lib/validation/admin";

export async function createTalent(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = createTalentSchema.safeParse({
    displayName: raw.displayName,
    title: raw.title,
    bio: raw.bio,
    skills: raw.skills,
    yearsExperience: raw.yearsExperience,
  });
  if (!parsed.success) return;

  await supabase.from("talent").insert({
    display_name: parsed.data.displayName,
    title: parsed.data.title || null,
    bio: parsed.data.bio || null,
    skills: parsed.data.skills,
    years_experience: parsed.data.yearsExperience,
    status: "draft",
    approved: false,
    public_visible: false,
  });

  revalidatePath("/admin/talent");
}

export async function toggleTalentFlag(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const parsed = toggleTalentSchema.safeParse({
    talentId: formData.get("talentId"),
    field: formData.get("field"),
    value: formData.get("value"),
  });
  if (!parsed.success) return;

  const patch =
    parsed.data.field === "approved"
      ? {
          approved: parsed.data.value,
          status: parsed.data.value ? ("active" as const) : ("draft" as const),
        }
      : { public_visible: parsed.data.value };

  await supabase.from("talent").update(patch).eq("id", parsed.data.talentId);

  revalidatePath("/admin/talent");
}
