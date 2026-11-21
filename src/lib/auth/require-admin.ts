import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/admin/login?error=not_configured");
  }

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    redirect("/admin/login");
  }

  const userId = claimsData.claims.sub as string;
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("user_id, email")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !admin) {
    redirect("/admin/login?error=forbidden");
  }

  return { supabase, userId, email: admin.email as string };
}

export async function getOptionalAdmin() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub as string | undefined;
  if (!userId) return null;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id, email")
    .eq("user_id", userId)
    .maybeSingle();
  if (!admin) return null;
  return { supabase, userId, email: admin.email as string };
}
