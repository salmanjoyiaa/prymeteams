import {
  DbError,
  Flash,
  PageHeader,
  SectionHeader,
  btnGhost,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { updateSiteSettings } from "./actions";
import { seedDemoData } from "./seed-actions";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "contact_email, domain, office_location, buy_out_terms, discovery_url",
    )
    .eq("id", 1)
    .maybeSingle();

  const settings = data ?? {
    contact_email: DEFAULT_SITE_SETTINGS.contactEmail,
    domain: DEFAULT_SITE_SETTINGS.domain,
    office_location: DEFAULT_SITE_SETTINGS.officeLocation,
    buy_out_terms: DEFAULT_SITE_SETTINGS.buyOutTerms,
    discovery_url: DEFAULT_SITE_SETTINGS.discoveryUrl,
  };

  return (
    <div>
      <PageHeader
        eyebrow="Business"
        title="Site settings"
        subtitle="Public contact details shown on the homepage."
      />
      {error ? <DbError message={error.message} /> : null}
      {sp.error ? (
        <DbError message="Could not save settings. Check the fields and try again." />
      ) : null}
      <Flash message={sp.saved === "1" ? "Settings saved. Homepage revalidated." : undefined} />

      <p className="mb-6 max-w-xl text-sm text-pt-muted">
        Saving updates public placeholders immediately. Use relative paths,
        https://, or mailto: for the discovery CTA URL.
      </p>

      <form action={updateSiteSettings} className={`${cardClass()} max-w-xl space-y-4`}>
        <SectionHeader title="Public placeholders" />
        <div>
          <label className={labelClass()} htmlFor="contactEmail">
            Contact email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            required
            defaultValue={settings.contact_email}
            className={inputClass()}
          />
        </div>
        <div>
          <label className={labelClass()} htmlFor="domain">
            Domain
          </label>
          <input
            id="domain"
            name="domain"
            required
            defaultValue={settings.domain}
            className={inputClass()}
          />
        </div>
        <div>
          <label className={labelClass()} htmlFor="officeLocation">
            Office location
          </label>
          <input
            id="officeLocation"
            name="officeLocation"
            required
            defaultValue={settings.office_location}
            className={inputClass()}
          />
        </div>
        <div>
          <label className={labelClass()} htmlFor="buyOutTerms">
            Buy-out terms (FAQ)
          </label>
          <textarea
            id="buyOutTerms"
            name="buyOutTerms"
            required
            rows={3}
            defaultValue={settings.buy_out_terms}
            className={inputClass()}
          />
        </div>
        <div>
          <label className={labelClass()} htmlFor="discoveryUrl">
            Discovery CTA URL
          </label>
          <input
            id="discoveryUrl"
            name="discoveryUrl"
            required
            defaultValue={settings.discovery_url}
            className={inputClass()}
          />
        </div>
        <button type="submit" className={btnPrimary()}>
          Save settings
        </button>
      </form>

      <section className={`${cardClass()} mt-8 max-w-xl space-y-3`}>
        <SectionHeader
          title="Demo data"
          subtitle="Load a realistic CRM/ops showcase dataset (safe to re-run)"
        />
        <p className="text-sm text-pt-muted">
          Seeds companies, leads, talent, jobs, placements, tasks, and finance
          sample rows tagged DEMO_SEED. Requires an admin session.
        </p>
        <form action={seedDemoData}>
          <button type="submit" className={btnGhost()}>
            Seed demo dashboard
          </button>
        </form>
        {sp.saved === "seed" ? (
          <Flash message="Demo data loaded. Open Leads, Talent, Jobs, and Finance." />
        ) : null}
      </section>
    </div>
  );
}
