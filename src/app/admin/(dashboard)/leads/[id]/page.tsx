import Link from "next/link";
import {
  BackLink,
  DbError,
  Flash,
  PageHeader,
  SectionHeader,
  StatusPill,
  btnGhost,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
  linkClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { LEAD_STAGES } from "@/lib/validation/admin";
import { addFollowUp, addNote, convertLead, updateStage } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function AdminLeadDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const { supabase } = await requireAdmin();

  const [
    { data: lead, error: leadError },
    { data: notes, error: notesError },
    { data: followUps, error: fuError },
  ] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("lead_notes")
      .select("id, body, created_at, created_by")
      .eq("lead_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("follow_ups")
      .select("id, due_at, note, completed")
      .eq("lead_id", id)
      .order("due_at", { ascending: true }),
  ]);

  const loadError = leadError ?? notesError ?? fuError;

  if (!lead && !leadError) {
    return (
      <div>
        <BackLink href="/admin/leads" label="All leads" />
        <DbError message="Lead not found." />
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/admin/leads" label="All leads" />
      <PageHeader
        eyebrow="CRM · Lead"
        title={lead?.full_name ?? "Lead"}
        subtitle={lead?.email}
        actions={lead ? <StatusPill value={lead.stage} /> : null}
      />

      {loadError ? <DbError message={loadError.message} /> : null}
      {sp.error ? (
        <DbError
          message={
            sp.error === "1" || sp.error === "true"
              ? "Could not save changes. Please try again."
              : "Something went wrong. Please try again."
          }
        />
      ) : null}
      <Flash message={sp.saved === "1" ? "Saved." : undefined} />

      {lead ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className={cardClass()}>
            <SectionHeader title="Summary" subtitle="Contact and pipeline" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-[#1A2030] pb-3">
                <dt className="text-pt-muted">Stage</dt>
                <dd>
                  <StatusPill value={lead.stage} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-pt-muted">Company</dt>
                <dd className="text-[#C3CADA]">{lead.company_name ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-pt-muted">Phone</dt>
                <dd className="text-[#C3CADA]">{lead.phone ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-pt-muted">Plan</dt>
                <dd className="capitalize text-[#C3CADA]">
                  {String(lead.plan_type).replace(/_/g, " ")}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-pt-muted">Intent</dt>
                <dd className="capitalize text-[#C3CADA]">{lead.intent}</dd>
              </div>
              {lead.company_id ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-pt-muted">Linked company</dt>
                  <dd>
                    <Link href="/admin/companies" className={linkClass()}>
                      View companies
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
            {lead.message ? (
              <p className="mt-5 rounded-xl border border-[#1A2030] bg-pt-bg p-4 text-sm leading-relaxed text-[#C3CADA] whitespace-pre-wrap">
                {lead.message}
              </p>
            ) : null}

            <form action={updateStage} className="mt-6 flex flex-wrap items-end gap-3">
              <input type="hidden" name="leadId" value={lead.id} />
              <div className="min-w-[200px] flex-1">
                <label htmlFor="stage" className={labelClass()}>
                  Update stage
                </label>
                <select
                  id="stage"
                  name="stage"
                  defaultValue={lead.stage}
                  className={inputClass()}
                >
                  {LEAD_STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={btnGhost()}>
                Save stage
              </button>
            </form>

            {!lead.company_id ? (
              <form action={convertLead} className="mt-4">
                <input type="hidden" name="leadId" value={lead.id} />
                <button type="submit" className={btnPrimary()}>
                  Convert to company + contact
                </button>
              </form>
            ) : null}
          </section>

          <div className="space-y-6">
            <section className={cardClass()}>
              <SectionHeader title="Notes" />
              <ul className="space-y-3">
                {notes?.length ? (
                  notes.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-xl border border-[#1A2030] bg-pt-bg p-3 text-sm"
                    >
                      <p className="text-[#C3CADA] whitespace-pre-wrap">{n.body}</p>
                      <p className="mt-2 text-xs text-[#6B7289]">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-[#8A93A6]">No notes yet.</p>
                )}
              </ul>
              <form action={addNote} className="mt-4 space-y-3">
                <input type="hidden" name="leadId" value={lead.id} />
                <label htmlFor="body" className={labelClass()}>
                  Add note
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={3}
                  required
                  className={inputClass()}
                />
                <button type="submit" className={btnPrimary()}>
                  Add note
                </button>
              </form>
            </section>

            <section className={cardClass()}>
              <SectionHeader title="Follow-ups" />
              <ul className="space-y-3">
                {followUps?.length ? (
                  followUps.map((f) => (
                    <li
                      key={f.id}
                      className="rounded-xl border border-[#1A2030] bg-pt-bg p-3 text-sm"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-pt-gold">
                          Due {new Date(f.due_at).toLocaleString()}
                        </p>
                        {f.completed ? (
                          <StatusPill value="done" />
                        ) : (
                          <StatusPill value="pending" />
                        )}
                      </div>
                      {f.note ? (
                        <p className="mt-1 text-[#C3CADA]">{f.note}</p>
                      ) : null}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-[#8A93A6]">No follow-ups scheduled.</p>
                )}
              </ul>
              <form action={addFollowUp} className="mt-4 space-y-3">
                <input type="hidden" name="leadId" value={lead.id} />
                <label htmlFor="dueAt" className={labelClass()}>
                  Schedule follow-up
                </label>
                <input
                  id="dueAt"
                  name="dueAt"
                  type="datetime-local"
                  required
                  className={inputClass()}
                />
                <input
                  name="note"
                  type="text"
                  placeholder="Optional note"
                  className={inputClass()}
                />
                <button type="submit" className={btnPrimary()}>
                  Add follow-up
                </button>
              </form>
            </section>
          </div>
        </div>
      ) : null}
    </div>
  );
}
