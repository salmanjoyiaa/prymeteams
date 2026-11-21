import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_PUBLIC_SITE,
  normalizeSettings,
  type PublicSiteBundle,
} from "@/lib/settings";

export async function getSiteSettings(): Promise<PublicSiteBundle> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_PUBLIC_SITE;

    // Prefer full select; if optional call columns are missing, fall back.
    const full = await supabase
      .from("site_settings")
      .select(
        "contact_email, domain, office_location, buy_out_terms, discovery_url, phone, after_phone, hours_label, call_timezone, open_hour, close_hour, open_weekends",
      )
      .eq("id", 1)
      .maybeSingle();

    if (!full.error && full.data) return normalizeSettings(full.data);

    const basic = await supabase
      .from("site_settings")
      .select(
        "contact_email, domain, office_location, buy_out_terms, discovery_url",
      )
      .eq("id", 1)
      .maybeSingle();

    if (basic.error || !basic.data) return DEFAULT_PUBLIC_SITE;
    return normalizeSettings(basic.data);
  } catch {
    return DEFAULT_PUBLIC_SITE;
  }
}
