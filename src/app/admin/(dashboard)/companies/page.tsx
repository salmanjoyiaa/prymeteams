import {
  DbError,
  EmptyState,
  PageHeader,
  SectionHeader,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
  tableWrap,
  tdClass,
  thClass,
  trClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createCompany } from "./actions";

export default async function AdminCompaniesPage() {
  const { supabase } = await requireAdmin();
  const { data: companies, error } = await supabase
    .from("companies")
    .select("id, name, website, industry, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Companies" subtitle="Client organizations." />

      {error ? <DbError message={`Could not load companies: ${error.message}`} /> : null}

      <form action={createCompany} className={`${cardClass()} mb-8 max-w-xl space-y-4`}>
        <SectionHeader title="Add company" subtitle="Create a client record" />
        <div>
          <label htmlFor="name" className={labelClass()}>
            Name *
          </label>
          <input id="name" name="name" required className={inputClass()} />
        </div>
        <div>
          <label htmlFor="website" className={labelClass()}>
            Website
          </label>
          <input id="website" name="website" className={inputClass()} />
        </div>
        <div>
          <label htmlFor="industry" className={labelClass()}>
            Industry
          </label>
          <input id="industry" name="industry" className={inputClass()} />
        </div>
        <div>
          <label htmlFor="notes" className={labelClass()}>
            Notes
          </label>
          <textarea id="notes" name="notes" rows={2} className={inputClass()} />
        </div>
        <button type="submit" className={btnPrimary()}>
          Create company
        </button>
      </form>

      {!error && (!companies || companies.length === 0) ? (
        <EmptyState
          title="No companies yet"
          description="Add your first client organization with the form above."
        />
      ) : null}

      {companies && companies.length > 0 ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>Name</th>
                <th className={thClass()}>Website</th>
                <th className={thClass()}>Industry</th>
                <th className={thClass()}>Created</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className={trClass()}>
                  <td className={tdClass()}>{c.name}</td>
                  <td className={tdClass()}>{c.website ?? "—"}</td>
                  <td className={tdClass()}>{c.industry ?? "—"}</td>
                  <td className={tdClass()}>
                    {new Date(c.created_at).toLocaleDateString()}
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
