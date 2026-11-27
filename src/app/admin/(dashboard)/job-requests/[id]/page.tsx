import {
  BackLink,
  DbError,
  PageHeader,
  SectionHeader,
  StatusPill,
  btnGhost,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { JOB_STATUSES } from "@/lib/validation/admin";
import { addInterview, addShortlist, updateJobRequest } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function JobRequestDetailPage({ params }: Props) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [
    { data: job, error },
    { data: shortlists },
    { data: interviews },
    { data: talent },
  ] = await Promise.all([
    supabase.from("job_requests").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("shortlists")
      .select("id, talent_id, notes, created_at")
      .eq("job_request_id", id),
    supabase
      .from("interviews")
      .select("id, talent_id, scheduled_at, notes, outcome")
      .eq("job_request_id", id),
    supabase.from("talent").select("id, display_name").order("display_name"),
  ]);

  if (!job) {
    return (
      <div>
        <BackLink href="/admin/job-requests" label="Job requests" />
        <DbError message={error?.message ?? "Job request not found."} />
      </div>
    );
  }

  const talentMap = new Map((talent ?? []).map((t) => [t.id, t.display_name]));

  return (
    <div>
      <BackLink href="/admin/job-requests" label="Job requests" />
      <PageHeader
        eyebrow="Delivery · Job"
        title={job.title}
        subtitle={job.description ?? undefined}
        actions={<StatusPill value={job.status} />}
      />

      <form
        action={updateJobRequest}
        className={`${cardClass()} mb-6 flex flex-wrap items-end gap-3`}
      >
        <input type="hidden" name="jobRequestId" value={job.id} />
        <input type="hidden" name="title" value={job.title} />
        <input type="hidden" name="description" value={job.description ?? ""} />
        <div className="min-w-[200px]">
          <label htmlFor="job-status" className={labelClass()}>
            Pipeline status
          </label>
          <select
            id="job-status"
            name="status"
            defaultValue={job.status}
            className={inputClass()}
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={btnGhost()}>
          Update status
        </button>
      </form>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass()}>
          <SectionHeader title="Shortlist" subtitle="Talent under consideration" />
          <ul className="space-y-2">
            {(shortlists ?? []).map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-[#1A2030] bg-pt-bg px-3 py-2.5 text-sm text-[#C3CADA]"
              >
                <span className="font-medium text-pt-text">
                  {talentMap.get(s.talent_id) ?? s.talent_id}
                </span>
                {s.notes ? (
                  <span className="mt-0.5 block text-pt-muted">{s.notes}</span>
                ) : null}
              </li>
            ))}
            {!shortlists?.length ? (
              <li className="text-sm text-[#8A93A6]">No shortlisted talent yet.</li>
            ) : null}
          </ul>
          <form action={addShortlist} className="mt-4 space-y-3">
            <input type="hidden" name="jobRequestId" value={job.id} />
            <label className={labelClass()} htmlFor="talentId">
              Add to shortlist
            </label>
            <select
              id="talentId"
              name="talentId"
              required
              className={inputClass()}
              defaultValue=""
            >
              <option value="" disabled>
                Select talent
              </option>
              {(talent ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.display_name}
                </option>
              ))}
            </select>
            <input name="notes" placeholder="Notes" className={inputClass()} />
            <button type="submit" className={btnPrimary()}>
              Add
            </button>
          </form>
        </section>

        <section className={cardClass()}>
          <SectionHeader title="Interviews" subtitle="Scheduled conversations" />
          <ul className="space-y-2">
            {(interviews ?? []).map((i) => (
              <li
                key={i.id}
                className="rounded-xl border border-[#1A2030] bg-pt-bg px-3 py-2.5 text-sm text-[#C3CADA]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-pt-text">
                    {talentMap.get(i.talent_id) ?? i.talent_id}
                  </span>
                  {i.outcome ? <StatusPill value={i.outcome} /> : null}
                </div>
                {i.scheduled_at ? (
                  <span className="mt-1 block text-xs text-pt-muted">
                    {new Date(i.scheduled_at).toLocaleString()}
                  </span>
                ) : null}
              </li>
            ))}
            {!interviews?.length ? (
              <li className="text-sm text-[#8A93A6]">No interviews scheduled.</li>
            ) : null}
          </ul>
          <form action={addInterview} className="mt-4 space-y-3">
            <input type="hidden" name="jobRequestId" value={job.id} />
            <label className={labelClass()} htmlFor="interviewTalent">
              Schedule interview
            </label>
            <select
              id="interviewTalent"
              name="talentId"
              required
              className={inputClass()}
              defaultValue=""
            >
              <option value="" disabled>
                Select talent
              </option>
              {(talent ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.display_name}
                </option>
              ))}
            </select>
            <input
              name="scheduledAt"
              type="datetime-local"
              className={inputClass()}
            />
            <input name="notes" placeholder="Notes" className={inputClass()} />
            <button type="submit" className={btnPrimary()}>
              Add interview
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
