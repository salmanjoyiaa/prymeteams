import Link from "next/link";
import type { ReactNode } from "react";

export type StatusTone = "neutral" | "attention" | "positive" | "danger";

const TONE_CLASS: Record<StatusTone, string> = {
  neutral:
    "border-pt-border bg-pt-bg text-pt-muted",
  attention:
    "border-pt-gold/40 bg-pt-bg text-pt-gold",
  positive:
    "border-pt-accent/40 bg-pt-bg text-pt-accent",
  danger:
    "border-pt-red/40 bg-pt-bg text-pt-red",
};

/** Map common CRM / ops status strings to a restrained tone. */
export function statusTone(value: string): StatusTone {
  const v = value.toLowerCase();
  if (
    [
      "new",
      "open",
      "pending",
      "draft",
      "shortlisting",
      "interviewing",
      "proposal_sent",
      "contacted",
      "qualified",
      "sent",
      "in_progress",
    ].includes(v)
  ) {
    return "attention";
  }
  if (
    [
      "active",
      "converted",
      "filled",
      "paid",
      "completed",
      "done",
      "approved",
      "buyout",
    ].includes(v)
  ) {
    return "positive";
  }
  if (
    ["lost", "cancelled", "failed", "overdue", "void", "refunded", "inactive"].includes(
      v,
    )
  ) {
    return "danger";
  }
  return "neutral";
}

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5 sm:mb-8">
      <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold tracking-tight text-pt-text sm:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 text-sm text-pt-muted sm:mt-2">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
      <div className="min-w-0">
        <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold tracking-tight text-pt-text sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-pt-muted sm:mt-2">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="font-[family-name:var(--font-archivo)] text-lg font-bold text-pt-text">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-xs text-pt-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  href,
  emphasize,
}: {
  label: string;
  value: number | string;
  href: string;
  emphasize?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-2xl border p-5 no-underline transition ${
        emphasize
          ? "border-pt-accent/50 bg-pt-surface shadow-[0_0_0_1px_rgba(46,230,160,0.08)] hover:border-pt-accent"
          : "border-pt-border bg-pt-surface hover:border-pt-accent/60"
      }`}
    >
      <p className="text-sm text-pt-muted">{label}</p>
      <p
        className={`mt-2 font-[family-name:var(--font-archivo)] text-3xl font-extrabold tabular-nums ${
          emphasize ? "text-pt-accent" : "text-pt-text"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}

export function DbError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-pt-red/50 bg-[#1E2436] px-4 py-3 text-sm text-[#FFB4B6]"
    >
      {message}
    </div>
  );
}

export function Flash({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-6 rounded-xl border border-pt-accent/40 bg-pt-surface px-4 py-3 text-sm text-pt-accent">
      {message}
    </div>
  );
}

export function EmptyState({
  label,
  title,
  description,
  children,
}: {
  label?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  const heading = title ?? (label ? `No ${label} yet` : "Nothing here yet");
  const body =
    description ??
    (label
      ? `Add the first ${label.replace(/s$/, "")} using the form above when you’re ready.`
      : undefined);

  return (
    <div className="rounded-2xl border border-dashed border-pt-border bg-pt-surface px-6 py-10 text-center">
      <p className="font-[family-name:var(--font-archivo)] text-base font-semibold text-pt-text">
        {heading}
      </p>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm text-pt-muted">{body}</p> : null}
      {children ? <div className="mt-4 flex justify-center">{children}</div> : null}
    </div>
  );
}

export function inputClass() {
  return "w-full rounded-lg border border-pt-border bg-pt-bg px-3 py-2.5 text-sm text-pt-text placeholder:text-[#6B7289] focus:border-pt-accent focus:outline-none";
}

export function labelClass() {
  return "mb-1.5 block text-xs font-medium uppercase tracking-wide text-pt-muted";
}

export function btnPrimary() {
  return "inline-flex min-h-10 items-center justify-center rounded-lg bg-pt-accent px-4 py-2 text-sm font-semibold text-pt-bg transition hover:brightness-110";
}

export function btnGhost() {
  return "inline-flex min-h-10 items-center justify-center rounded-lg border border-pt-border px-4 py-2 text-sm text-[#C3CADA] transition hover:border-pt-accent hover:text-white";
}

export function cardClass() {
  return "rounded-2xl border border-pt-border bg-pt-surface p-4 sm:p-6";
}

export function tableWrap() {
  return "overflow-x-auto rounded-2xl border border-pt-border bg-pt-surface";
}

export function thClass() {
  return "sticky top-0 bg-[#0B0E18] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-pt-muted";
}

export function tdClass() {
  return "border-t border-[#1A2030] px-4 py-3 text-sm text-[#C3CADA] transition-colors group-hover:bg-[#0B0E18]/60";
}

export function trClass() {
  return "group";
}

export function linkClass() {
  return "text-pt-accent no-underline hover:underline";
}

export function filterChipClass(active: boolean) {
  return `inline-flex min-h-9 items-center rounded-lg px-3 py-1.5 text-sm no-underline transition ${
    active
      ? "bg-pt-accent font-semibold text-pt-bg"
      : "border border-pt-border text-[#C3CADA] hover:border-pt-accent/50"
  }`;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={`${linkClass()} mb-4 inline-block text-sm`}>
      ← {label}
    </Link>
  );
}

export function StatusPill({
  value,
  tone,
}: {
  value: string;
  tone?: StatusTone;
}) {
  const t = tone ?? statusTone(value);
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${TONE_CLASS[t]}`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

/** @deprecated Prefer StatusPill — kept for existing call sites */
export function StagePill({ stage }: { stage: string }) {
  return <StatusPill value={stage} />;
}
