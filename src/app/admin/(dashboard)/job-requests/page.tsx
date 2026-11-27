import Link from "next/link";
import {
  DbError,
  EmptyState,
  PageHeader,
  SectionHeader,
  StatusPill,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
  linkClass,
  tableWrap,
  tdClass,
  thClass,
  trClass,
} from "@/components/admin/AdminChrome";
import { AiAssistPanel } from "@/components/admin/AiAssistPanel";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { requireAdmin } from "@/lib/auth/require-admin";
import { JOB_STATUSES } from "@/lib/validation/admin";
import { createJobRequest, deleteJobRequest } from "./actions";

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
      <PageHeader
        eyebrow="Delivery"
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
        <SectionHeader title="Add job request" subtitle="Open a new role" />
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
          <div className="mt-2">
            <AiAssistPanel
              kind="job_description"
              label="Expand with AI"
              applyToId="description"
              sourceIds={{ title: "title", description: "description" }}
            />
          </div>
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
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={btnPrimary()}>
          Create
        </button>
      </form>

      {!error && (!jobs || jobs.length === 0) ? (
        <EmptyState
          title="No job requests yet"
          description="Create a role with the form above to start shortlisting talent."
        />
      ) : null}

      {jobs && jobs.length > 0 ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>Title</th>
                <th className={thClass()}>Company</th>
                <th className={thClass()}>Status</th>
                <th className={thClass()}>Created</th>
                <th className={thClass()}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className={trClass()}>
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
                  <td className={tdClass()}>
                    <StatusPill value={j.status} />
                  </td>
                  <td className={tdClass()}>
                    {new Date(j.created_at).toLocaleDateString()}
                  </td>
                  <td className={tdClass()}>
                    <ConfirmDelete
                      action={deleteJobRequest}
                      idName="id"
                      idValue={j.id}
                      confirmMessage={`Delete job ${j.title}?`}
                    />
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
