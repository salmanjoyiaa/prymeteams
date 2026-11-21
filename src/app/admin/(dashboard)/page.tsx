import Link from "next/link";
import {
  KpiCard,
  PageHeader,
  SectionHeader,
  btnGhost,
  cardClass,
  linkClass,
} from "@/components/admin/AdminChrome";
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
  const { supabase, email } = await requireAdmin();

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

  const firstName = email.split("@")[0] ?? "there";

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${firstName}`}
        subtitle="Live pipeline and ops counts from Supabase. Jump into any area below."
        actions={
          <Link href="/admin/leads?stage=new" className={btnGhost()}>
            Review new leads
          </Link>
        }
      />

      <section className={`${cardClass()} mb-8 overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-pt-gold uppercase">
              Attention
            </p>
            <p className="mt-1 font-[family-name:var(--font-archivo)] text-xl font-bold text-pt-text">
              {newLeads === 0
                ? "Inbox is clear"
                : `${newLeads} new lead${newLeads === 1 ? "" : "s"} waiting`}
            </p>
            <p className="mt-1 text-sm text-pt-muted">
              {newLeads === 0
                ? "New website inquiries will land here automatically."
                : "Qualify, note, and convert from the leads pipeline."}
            </p>
          </div>
          <Link href="/admin/leads?stage=new" className={linkClass()}>
            Open pipeline →
          </Link>
        </div>
      </section>

      <SectionHeader title="Pipeline" subtitle="Demand and accounts" />
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="New leads"
          value={newLeads}
          href="/admin/leads?stage=new"
          emphasize
          hint="Needs review"
        />
        <KpiCard label="All leads" value={leads} href="/admin/leads" hint="Total" />
        <KpiCard
          label="Companies"
          value={companies}
          href="/admin/companies"
          hint="Accounts"
        />
      </div>

      <SectionHeader title="Delivery" subtitle="Talent and fulfillment" />
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Talent" value={talent} href="/admin/talent" hint="Roster" />
        <KpiCard
          label="Placements"
          value={placements}
          href="/admin/placements"
          hint="Active + past"
        />
        <KpiCard
          label="Open tasks"
          value={openTasks}
          href="/admin/tasks"
          hint="Ops"
        />
      </div>

      <SectionHeader title="Finance" subtitle="Billing snapshot" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Invoices"
          value={invoices}
          href="/admin/finance"
          hint="All statuses"
        />
        <Link
          href="/admin/settings"
          className={`${cardClass()} no-underline transition hover:border-pt-accent/40`}
        >
          <p className="text-[13px] font-medium text-pt-muted">Site settings</p>
          <p className="mt-3 font-[family-name:var(--font-archivo)] text-lg font-bold text-pt-text">
            Edit public placeholders
          </p>
          <p className="mt-2 text-sm text-pt-accent">Open settings →</p>
        </Link>
        <Link
          href="/admin/audit"
          className={`${cardClass()} no-underline transition hover:border-pt-accent/40`}
        >
          <p className="text-[13px] font-medium text-pt-muted">Audit</p>
          <p className="mt-3 font-[family-name:var(--font-archivo)] text-lg font-bold text-pt-text">
            Review recent changes
          </p>
          <p className="mt-2 text-sm text-pt-accent">Open audit log →</p>
        </Link>
      </div>
    </div>
  );
}
