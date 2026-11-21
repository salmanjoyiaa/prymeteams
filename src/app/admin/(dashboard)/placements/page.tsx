import {
  DbError,
  EmptyState,
  PageTitle,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
  tableWrap,
  tdClass,
  thClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { PLACEMENT_STATUSES } from "@/lib/validation/admin";
import { createPlacement, updatePlacementStatus } from "./actions";

export default async function PlacementsPage() {
  const { supabase } = await requireAdmin();
  const [
    { data: placements, error },
    { data: companies },
    { data: talent },
    { data: jobs },
  ] = await Promise.all([
    supabase
      .from("placements")
      .select("id, company_id, talent_id, status, start_date, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("companies").select("id, name").order("name"),
    supabase.from("talent").select("id, display_name").order("display_name"),
    supabase.from("job_requests").select("id, title").order("created_at", {
      ascending: false,
    }),
  ]);

  const companyMap = new Map((companies ?? []).map((c) => [c.id, c.name]));
  const talentMap = new Map((talent ?? []).map((t) => [t.id, t.display_name]));

  return (
    <div>
      <PageTitle title="Placements" subtitle="Active and historical placements." />
      {error ? <DbError message={error.message} /> : null}

      <form action={createPlacement} className={`${cardClass()} mb-8 max-w-xl space-y-4`}>
        <h2 className="text-lg font-semibold">Create placement</h2>
        <div>
          <label className={labelClass()} htmlFor="companyId">
            Company
          </label>
          <select id="companyId" name="companyId" required className={inputClass()} defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {(companies ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass()} htmlFor="talentId">
            Talent
          </label>
          <select id="talentId" name="talentId" required className={inputClass()} defaultValue="">
            <option value="" disabled>
              Select
            </option>
            {(talent ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.display_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass()} htmlFor="jobRequestId">
            Job request (optional)
          </label>
          <select id="jobRequestId" name="jobRequestId" className={inputClass()} defaultValue="">
            <option value="">— None —</option>
            {(jobs ?? []).map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass()} htmlFor="startDate">
            Start date
          </label>
          <input id="startDate" name="startDate" type="date" className={inputClass()} />
        </div>
        <button type="submit" className={btnPrimary()}>
          Create
        </button>
      </form>

      {!error && !placements?.length ? <EmptyState label="placements" /> : null}

      {placements?.length ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-[#0B0E18]">
              <tr>
                <th className={thClass()}>Company</th>
                <th className={thClass()}>Talent</th>
                <th className={thClass()}>Status</th>
                <th className={thClass()}>Start</th>
                <th className={thClass()}>Update</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p) => (
                <tr key={p.id}>
                  <td className={tdClass()}>
                    {p.company_id ? companyMap.get(p.company_id) : "—"}
                  </td>
                  <td className={tdClass()}>
                    {p.talent_id ? talentMap.get(p.talent_id) : "—"}
                  </td>
                  <td className={tdClass()}>{p.status}</td>
                  <td className={tdClass()}>{p.start_date ?? "—"}</td>
                  <td className={tdClass()}>
                    <form action={updatePlacementStatus} className="flex gap-2">
                      <input type="hidden" name="placementId" value={p.id} />
                      <select
                        name="status"
                        defaultValue={p.status}
                        className={inputClass()}
                      >
                        {PLACEMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className={btnPrimary()}>
                        Save
                      </button>
                    </form>
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
