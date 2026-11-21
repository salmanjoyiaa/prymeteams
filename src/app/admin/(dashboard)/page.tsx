import { KpiCard, PageHeader } from "@/components/admin/AdminChrome";
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
    {
      label: "New leads",
      value: newLeads,
      href: "/admin/leads?stage=new",
      emphasize: true,
    },
    { label: "All leads", value: leads, href: "/admin/leads" },
    { label: "Companies", value: companies, href: "/admin/companies" },
    { label: "Talent", value: talent, href: "/admin/talent" },
    { label: "Placements", value: placements, href: "/admin/placements" },
    { label: "Open tasks", value: openTasks, href: "/admin/tasks" },
    { label: "Invoices", value: invoices, href: "/admin/finance" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Live counts from your Supabase data. Connect env vars and seed rows to populate KPIs."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <KpiCard
            key={c.label}
            label={c.label}
            value={c.value}
            href={c.href}
            emphasize={c.emphasize}
          />
        ))}
      </div>
    </div>
  );
}
