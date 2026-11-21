import {
  DbError,
  EmptyState,
  PageHeader,
  StatusPill,
  tableWrap,
  tdClass,
  thClass,
  trClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AuditPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, table_name, record_id, action, actor, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <PageHeader
        title="Audit log"
        subtitle="Recent state-changing operations (read-only)."
      />
      {error ? <DbError message={error.message} /> : null}
      {!error && !data?.length ? (
        <EmptyState
          title="No audit events yet"
          description="Entries appear automatically when admins create or update records."
        />
      ) : null}
      {data?.length ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>When</th>
                <th className={thClass()}>Table</th>
                <th className={thClass()}>Action</th>
                <th className={thClass()}>Record</th>
                <th className={thClass()}>Actor</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className={trClass()}>
                  <td className={tdClass()}>
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className={tdClass()}>{row.table_name}</td>
                  <td className={tdClass()}>
                    <StatusPill value={row.action} />
                  </td>
                  <td className={`${tdClass()} font-mono text-xs`}>
                    {row.record_id ?? "—"}
                  </td>
                  <td className={tdClass()}>{row.actor ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
