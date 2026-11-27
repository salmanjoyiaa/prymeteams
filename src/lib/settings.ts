export type SiteSettingsPublic = {
  contactEmail: string;
  domain: string;
  officeLocation: string;
  buyOutTerms: string;
  discoveryUrl: string;
};

/** Handoff v2 floating call + contact hours (PRYME_CALL). */
export type CallSettings = {
  phone: string;
  afterPhone: string;
  hoursLabel: string;
  timeZone: string;
  openHour: number;
  closeHour: number;
  openWeekends: boolean;
};

export type PublicSiteBundle = SiteSettingsPublic & { call: CallSettings };

export const DEFAULT_SITE_SETTINGS: SiteSettingsPublic = {
  contactEmail: "zach@prymeteams.co",
  domain: "[YOUR DOMAIN]",
  officeLocation: "[OFFICE LOCATION]",
  buyOutTerms: "[BUY-OUT TERMS]",
  discoveryUrl: "/request?intent=discovery",
};

export const DEFAULT_CALL_SETTINGS: CallSettings = {
  phone: "[PHONE NUMBER]",
  afterPhone: "[AFTER-HOURS NUMBER]",
  hoursLabel: "Mon–Fri · 9am–6pm ET",
  timeZone: "America/New_York",
  openHour: 9,
  closeHour: 18,
  openWeekends: false,
};

export const DEFAULT_PUBLIC_SITE: PublicSiteBundle = {
  ...DEFAULT_SITE_SETTINGS,
  call: DEFAULT_CALL_SETTINGS,
};

function resolved(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || /^\[[^\]]+\]$/.test(trimmed)) return fallback;
  return trimmed;
}

export function normalizeSettings(
  row: Partial<{
    contact_email: string | null;
    domain: string | null;
    office_location: string | null;
    buy_out_terms: string | null;
    discovery_url: string | null;
    phone: string | null;
    after_phone: string | null;
    hours_label: string | null;
    call_timezone: string | null;
    open_hour: number | null;
    close_hour: number | null;
    open_weekends: boolean | null;
  }> | null,
): PublicSiteBundle {
  return {
    contactEmail: resolved(row?.contact_email, DEFAULT_SITE_SETTINGS.contactEmail),
    domain: resolved(row?.domain, DEFAULT_SITE_SETTINGS.domain),
    officeLocation: resolved(
      row?.office_location,
      DEFAULT_SITE_SETTINGS.officeLocation,
    ),
    buyOutTerms: resolved(row?.buy_out_terms, DEFAULT_SITE_SETTINGS.buyOutTerms),
    discoveryUrl: resolved(
      row?.discovery_url,
      DEFAULT_SITE_SETTINGS.discoveryUrl,
    ),
    call: {
      phone: resolved(row?.phone, DEFAULT_CALL_SETTINGS.phone),
      afterPhone: resolved(row?.after_phone, DEFAULT_CALL_SETTINGS.afterPhone),
      hoursLabel: resolved(row?.hours_label, DEFAULT_CALL_SETTINGS.hoursLabel),
      timeZone:
        row?.call_timezone?.trim() || DEFAULT_CALL_SETTINGS.timeZone,
      openHour:
        typeof row?.open_hour === "number"
          ? row.open_hour
          : DEFAULT_CALL_SETTINGS.openHour,
      closeHour:
        typeof row?.close_hour === "number"
          ? row.close_hour
          : DEFAULT_CALL_SETTINGS.closeHour,
      openWeekends:
        typeof row?.open_weekends === "boolean"
          ? row.open_weekends
          : DEFAULT_CALL_SETTINGS.openWeekends,
    },
  };
}
