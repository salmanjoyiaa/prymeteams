import Link from "next/link";
import {
  DbError,
  EmptyState,
  PageTitle,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
  linkClass,
  tableWrap,
  tdClass,
  thClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { JOB_STATUSES } from "@/lib/validation/admin";
import { createJobRequest } from "./actions";

export default async function AdminJobRequestsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: jobs, error }, { data: companies }] = await Promise.all([
    supabase
      .from("job_requests")
      .select("id, title, status, created_at, company_id")
      .order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
  ]);

  const companyMap = new Map((companies ?? []).map((c) => [c.id, c.name]));

  return (
    <div>
      <PageTitle
        title="Job requests"
        subtitle="Open roles and matching pipeline."
      />

      {error ? (
        <DbError message={`Could not load job requests: ${error.message}`} />
      ) : null}

      <form
        action={createJobRequest}
        className={`${cardClass()} mb-8 max-w-xl space-y-4`}
      >
        <h2 className="text-lg font-semibold text-[#EEF1F7]">
          Create job request
        </h2>
        <div>
          <label htmlFor="title" className={labelClass()}>
            Title *
          </label>
          <input id="title" name="title" required className={inputClass()} />
        </div>
        <div>
          <label htmlFor="description" className={labelClass()}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className={inputClass()}
          />
        </div>
        <div>
          <label htmlFor="companyId" className={labelClass()}>
            Company
          </label>
          <select
            id="companyId"
            name="companyId"
            className={inputClass()}
            defaultValue=""
          >
            <option value="">— None —</option>
            {companies?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className={labelClass()}>
            Status
          </label>
          <select
            id="status"
            name="status"
            className={inputClass()}
            defaultValue="open"
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={btnPrimary()}>
          Create
        </button>
      </form>

      {!error && (!jobs || jobs.length === 0) ? (
        <EmptyState label="job requests" />
      ) : null}

      {jobs && jobs.length > 0 ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-[#0B0E18]">
              <tr>
                <th className={thClass()}>Title</th>
                <th className={thClass()}>Company</th>
                <th className={thClass()}>Status</th>
                <th className={thClass()}>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td className={tdClass()}>
                    <Link
                      href={`/admin/job-requests/${j.id}`}
                      className={linkClass()}
                    >
                      {j.title}
                    </Link>
                  </td>
                  <td className={tdClass()}>
                    {j.company_id
                      ? (companyMap.get(j.company_id) ?? "—")
                      : "—"}
                  </td>
                  <td className={tdClass()}>{j.status}</td>
                  <td className={tdClass()}>
                    {new Date(j.created_at).toLocaleDateString()}
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
