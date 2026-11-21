"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  formDataToObject,
  updateSiteSettingsSchema,
} from "@/lib/validation/admin";

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const raw = formDataToObject(formData);
  const parsed = updateSiteSettingsSchema.safeParse({
    contactEmail: raw.contactEmail,
    domain: raw.domain,
    officeLocation: raw.officeLocation,
    buyOutTerms: raw.buyOutTerms,
    discoveryUrl: raw.discoveryUrl,
  });
  if (!parsed.success) {
    redirect("/admin/settings?error=1");
  }

  const { error } = await supabase
    .from("site_settings")
    .update({
      contact_email: parsed.data.contactEmail,
      domain: parsed.data.domain,
      office_location: parsed.data.officeLocation,
      buy_out_terms: parsed.data.buyOutTerms,
      discovery_url: parsed.data.discoveryUrl,
    })
    .eq("id", 1);

  if (error) {
    redirect("/admin/settings?error=1");
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
