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
import { TASK_STATUSES } from "@/lib/validation/admin";
import { createActivity, createTask, updateTaskStatus } from "./actions";

export default async function TasksPage() {
  const { supabase } = await requireAdmin();
  const [{ data: tasks, error }, { data: activities }] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, status, due_at, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("activities")
      .select("id, summary, entity_type, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  return (
    <div>
      <PageTitle title="Tasks" subtitle="Ops tasks and activity timeline." />
      {error ? <DbError message={error.message} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <form action={createTask} className={`${cardClass()} mb-6 space-y-4`}>
            <h2 className="text-lg font-semibold">New task</h2>
            <input name="title" required placeholder="Title" className={inputClass()} />
            <textarea
              name="description"
              rows={2}
              placeholder="Description"
              className={inputClass()}
            />
            <input name="dueAt" type="datetime-local" className={inputClass()} />
            <button type="submit" className={btnPrimary()}>
              Create task
            </button>
          </form>

          {!tasks?.length ? <EmptyState label="tasks" /> : null}
          {tasks?.length ? (
            <div className={tableWrap()}>
              <table className="w-full border-collapse">
                <thead className="bg-[#0B0E18]">
                  <tr>
                    <th className={thClass()}>Title</th>
                    <th className={thClass()}>Status</th>
                    <th className={thClass()}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td className={tdClass()}>{t.title}</td>
                      <td className={tdClass()}>{t.status}</td>
                      <td className={tdClass()}>
                        <form action={updateTaskStatus} className="flex gap-2">
                          <input type="hidden" name="taskId" value={t.id} />
                          <select
                            name="status"
                            defaultValue={t.status}
                            className={inputClass()}
                          >
                            {TASK_STATUSES.map((s) => (
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

        <div>
          <section className={cardClass()}>
            <h2 className="text-lg font-semibold">Activity timeline</h2>
            <ul className="mt-4 space-y-3">
              {(activities ?? []).map((a) => (
                <li
                  key={a.id}
                  className="rounded-lg border border-[#1A2030] bg-[#07090F] p-3 text-sm"
                >
                  <p className="text-[#C3CADA]">{a.summary}</p>
                  <p className="mt-1 text-xs text-[#6B7289]">
                    {a.entity_type} · {new Date(a.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
              {!activities?.length ? (
                <li className="text-sm text-[#8A93A6]">No activity yet.</li>
              ) : null}
            </ul>
            <form action={createActivity} className="mt-4 space-y-3">
              <label className={labelClass()} htmlFor="summary">
                Log activity
              </label>
              <input type="hidden" name="entityType" value="general" />
              <textarea
                id="summary"
                name="summary"
                required
                rows={2}
                className={inputClass()}
              />
              <button type="submit" className={btnPrimary()}>
                Add
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
