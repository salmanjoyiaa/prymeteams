import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

async function count(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  table: string,
  filter?: { col: string; val: string },
) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = q.eq(filter.col, filter.val);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [leads, newLeads, companies, talent, placements, openTasks, invoices] =
    await Promise.all([
      count(supabase, "leads"),
      count(supabase, "leads", { col: "stage", val: "new" }),
      count(supabase, "companies"),
      count(supabase, "talent"),
      count(supabase, "placements"),
      count(supabase, "tasks", { col: "status", val: "open" }),
      count(supabase, "invoices"),
    ]);

  const cards = [
    { label: "Leads", value: leads, href: "/admin/leads" },
    { label: "New leads", value: newLeads, href: "/admin/leads?stage=new" },
    { label: "Companies", value: companies, href: "/admin/companies" },
    { label: "Talent", value: talent, href: "/admin/talent" },
    { label: "Placements", value: placements, href: "/admin/placements" },
    { label: "Open tasks", value: openTasks, href: "/admin/tasks" },
    { label: "Invoices", value: invoices, href: "/admin/finance" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-archivo)] text-3xl font-extrabold">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-[#9AA3B5]">
        KPIs from live database rows (empty until Supabase is connected and data
        exists).
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-[#1E2436] bg-[#0F1320] p-5 no-underline transition hover:border-[#2EE6A0]"
          >
            <p className="text-sm text-[#9AA3B5]">{c.label}</p>
            <p className="mt-2 font-[family-name:var(--font-archivo)] text-3xl font-extrabold text-[#2EE6A0]">
              {c.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
