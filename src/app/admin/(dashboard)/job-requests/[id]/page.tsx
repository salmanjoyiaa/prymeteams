import {
  BackLink,
  DbError,
  PageTitle,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { addInterview, addShortlist } from "../actions";

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
      <PageTitle title={job.title} subtitle={`Status: ${job.status}`} />
      {job.description ? (
        <p className="mb-6 max-w-2xl text-sm text-[#9AA3B5]">{job.description}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass()}>
          <h2 className="text-lg font-semibold">Shortlist</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#C3CADA]">
            {(shortlists ?? []).map((s) => (
              <li key={s.id}>
                {talentMap.get(s.talent_id) ?? s.talent_id}
                {s.notes ? ` — ${s.notes}` : ""}
              </li>
            ))}
            {!shortlists?.length ? (
              <li className="text-[#8A93A6]">No shortlisted talent yet.</li>
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
            <input
              name="notes"
              placeholder="Notes"
              className={inputClass()}
            />
            <button type="submit" className={btnPrimary()}>
              Add
            </button>
          </form>
        </section>

        <section className={cardClass()}>
          <h2 className="text-lg font-semibold">Interviews</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#C3CADA]">
            {(interviews ?? []).map((i) => (
              <li key={i.id}>
                {talentMap.get(i.talent_id) ?? i.talent_id}
                {i.scheduled_at
                  ? ` · ${new Date(i.scheduled_at).toLocaleString()}`
                  : ""}
              </li>
            ))}
            {!interviews?.length ? (
              <li className="text-[#8A93A6]">No interviews scheduled.</li>
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
