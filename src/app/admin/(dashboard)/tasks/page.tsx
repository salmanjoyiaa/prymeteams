import {
  DbError,
  EmptyState,
  PageHeader,
  SectionHeader,
  StatusPill,
  btnGhost,
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
      <PageHeader
        eyebrow="Delivery"
        title="Tasks"
        subtitle="Ops tasks and activity timeline."
      />
      {error ? <DbError message={error.message} /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <form action={createTask} className={`${cardClass()} mb-6 space-y-4`}>
            <SectionHeader title="New task" />
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

          {!tasks?.length ? (
            <EmptyState
              title="No tasks yet"
              description="Create a task with the form above to track ops work."
            />
          ) : null}
          {tasks?.length ? (
            <div className={tableWrap()}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className={thClass()}>Title</th>
                    <th className={thClass()}>Status</th>
                    <th className={thClass()}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} className={trClass()}>
                      <td className={tdClass()}>{t.title}</td>
                      <td className={tdClass()}>
                        <StatusPill value={t.status} />
                      </td>
                      <td className={tdClass()}>
                        <form action={updateTaskStatus} className="flex flex-wrap gap-2">
                          <input type="hidden" name="taskId" value={t.id} />
                          <select
                            name="status"
                            defaultValue={t.status}
                            className={inputClass()}
                          >
                            {TASK_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className={btnGhost()}>
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
            <SectionHeader
              title="Activity timeline"
              subtitle="Recent ops notes"
            />
            <ul className="relative space-y-0 border-l border-[#1A2030] pl-4">
              {(activities ?? []).map((a) => (
                <li key={a.id} className="relative pb-4 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute top-1.5 -left-[1.3rem] h-2 w-2 rounded-full bg-pt-accent/70"
                  />
                  <p className="text-sm text-[#C3CADA]">{a.summary}</p>
                  <p className="mt-1 text-xs text-[#6B7289]">
                    {a.entity_type} · {new Date(a.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
              {!activities?.length ? (
                <li className="text-sm text-[#8A93A6]">No activity yet.</li>
              ) : null}
            </ul>
            <form action={createActivity} className="mt-5 space-y-3 border-t border-[#1A2030] pt-4">
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
