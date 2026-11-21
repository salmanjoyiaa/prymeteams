import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
