import {
  DbError,
  Flash,
  PageTitle,
  btnPrimary,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/AdminChrome";
import { requireAdmin } from "@/lib/auth/require-admin";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { updateSiteSettings } from "./actions";

export default async function SettingsPage() {
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
      <PageTitle
        title="Site settings"
        subtitle="Public contact details shown on the homepage. Edit anytime."
      />
      {error ? <DbError message={error.message} /> : null}
      <Flash message="Changes revalidate the public homepage immediately." />

      <form action={updateSiteSettings} className={`${cardClass()} max-w-xl space-y-4`}>
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
    </div>
  );
}
