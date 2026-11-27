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
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { AiAssistPanel } from "@/components/admin/AiAssistPanel";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createTalent, deleteTalent, toggleTalentFlag } from "./actions";

export default async function AdminTalentPage() {
  const { supabase } = await requireAdmin();
  const { data: talent, error } = await supabase
    .from("talent")
    .select(
      "id, display_name, title, status, approved, public_visible, skills, created_at",
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        eyebrow="Delivery"
        title="Talent"
        subtitle="Roster, approval, and public visibility."
      />

      {error ? <DbError message={`Could not load talent: ${error.message}`} /> : null}

      <form action={createTalent} className={`${cardClass()} mb-8 max-w-xl space-y-4`}>
        <SectionHeader title="Add talent" subtitle="Create a profile draft" />
        <div>
          <label htmlFor="displayName" className={labelClass()}>
            Display name *
          </label>
          <input id="displayName" name="displayName" required className={inputClass()} />
        </div>
        <div>
          <label htmlFor="title" className={labelClass()}>
            Title
          </label>
          <input id="title" name="title" className={inputClass()} />
        </div>
        <div>
          <label htmlFor="bio" className={labelClass()}>
            Bio
          </label>
          <textarea id="bio" name="bio" rows={2} className={inputClass()} />
          <div className="mt-2">
            <AiAssistPanel
              kind="talent_bio"
              label="Polish bio with AI"
              applyToId="bio"
              sourceIds={{
                displayName: "displayName",
                title: "title",
                bio: "bio",
                skills: "skills",
              }}
            />
          </div>
        </div>
        <div>
          <label htmlFor="skills" className={labelClass()}>
            Skills (comma-separated)
          </label>
          <input id="skills" name="skills" className={inputClass()} />
        </div>
        <div>
          <label htmlFor="yearsExperience" className={labelClass()}>
            Years experience
          </label>
          <input
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min={0}
            className={inputClass()}
          />
        </div>
        <button type="submit" className={btnPrimary()}>
          Create profile
        </button>
      </form>

      {!error && (!talent || talent.length === 0) ? (
        <EmptyState
          title="No talent profiles yet"
          description="Add a profile with the form above, then approve and publish for /talent."
        />
      ) : null}

      {talent && talent.length > 0 ? (
        <div className={tableWrap()}>
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className={thClass()}>Name</th>
                <th className={thClass()}>Title</th>
                <th className={thClass()}>Status</th>
                <th className={thClass()}>Approved</th>
                <th className={thClass()}>Public</th>
                <th className={thClass()}>Skills</th>
                <th className={thClass()}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {talent.map((t) => (
                <tr key={t.id} className={trClass()}>
                  <td className={tdClass()}>{t.display_name}</td>
                  <td className={tdClass()}>{t.title ?? "—"}</td>
                  <td className={tdClass()}>
                    <StatusPill value={t.status} />
                  </td>
                  <td className={tdClass()}>
                    <form action={toggleTalentFlag} className="inline">
                      <input type="hidden" name="talentId" value={t.id} />
                      <input type="hidden" name="field" value="approved" />
                      <input
                        type="hidden"
                        name="value"
                        value={t.approved ? "false" : "true"}
                      />
                      <button type="submit" className={btnGhost()}>
                        {t.approved ? "Revoke" : "Approve"}
                      </button>
                    </form>
                  </td>
                  <td className={tdClass()}>
                    <form action={toggleTalentFlag} className="inline">
                      <input type="hidden" name="talentId" value={t.id} />
                      <input type="hidden" name="field" value="public_visible" />
                      <input
                        type="hidden"
                        name="value"
                        value={t.public_visible ? "false" : "true"}
                      />
                      <button type="submit" className={btnGhost()}>
                        {t.public_visible ? "Hide" : "Publish"}
                      </button>
                    </form>
                  </td>
                  <td className={tdClass()}>
                    {t.skills?.length ? t.skills.join(", ") : "—"}
                  </td>
                  <td className={tdClass()}>
                    <ConfirmDelete
                      action={deleteTalent}
                      idName="id"
                      idValue={t.id}
                      confirmMessage={`Delete ${t.display_name}?`}
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
