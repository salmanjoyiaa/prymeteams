import Link from "next/link";
import {
  DbError,
  EmptyState,
  PageTitle,
  StagePill,
  linkClass,
  tableWrap,
  tdClass,
  thClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { LEAD_STAGES } from "@/lib/validation/admin";
import type { LeadStage } from "@/lib/supabase/database.types";

type Props = { searchParams: Promise<{ stage?: string }> };

export default async function AdminLeadsPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const { stage } = await searchParams;

  const stageFilter: LeadStage | null =
    stage && (LEAD_STAGES as readonly string[]).includes(stage)
      ? (stage as LeadStage)
      : null;

  let query = supabase
    .from("leads")
    .select("id, full_name, email, company_name, stage, created_at")
    .order("created_at", { ascending: false });

  if (stageFilter) {
    query = query.eq("stage", stageFilter as (typeof LEAD_STAGES)[number]);
  }

  const { data: leads, error } = await query;

  return (
    <div>
      <PageTitle
        title="Leads"
        subtitle="Website inquiries and pipeline stages."
      />

      {error ? (
        <DbError message={`Could not load leads: ${error.message}`} />
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/leads"
          className={`rounded-lg px-3 py-1.5 text-sm no-underline ${
            !stageFilter
              ? "bg-[#2EE6A0] text-[#07090F]"
              : "border border-[#1E2436] text-[#C3CADA]"
          }`}
        >
          All
        </Link>
        {LEAD_STAGES.map((s) => (
          <Link
            key={s}
            href={`/admin/leads?stage=${s}`}
            className={`rounded-lg px-3 py-1.5 text-sm no-underline ${
              stageFilter === s
                ? "bg-[#2EE6A0] text-[#07090F]"
                : "border border-[#1E2436] text-[#C3CADA]"
            }`}
          >
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      {!error && (!leads || leads.length === 0) ? (
        <EmptyState label="leads" />
      ) : null}

      {leads && leads.length > 0 ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-[#0B0E18]">
              <tr>
                <th className={thClass()}>Name</th>
                <th className={thClass()}>Email</th>
                <th className={thClass()}>Company</th>
                <th className={thClass()}>Stage</th>
                <th className={thClass()}>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className={tdClass()}>
                    <Link href={`/admin/leads/${lead.id}`} className={linkClass()}>
                      {lead.full_name}
                    </Link>
                  </td>
                  <td className={tdClass()}>{lead.email}</td>
                  <td className={tdClass()}>{lead.company_name ?? "—"}</td>
                  <td className={tdClass()}>
                    <StagePill stage={lead.stage} />
                  </td>
                  <td className={tdClass()}>
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}