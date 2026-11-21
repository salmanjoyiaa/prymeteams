import Link from "next/link";
import type { ReactNode } from "react";

export type StatusTone = "neutral" | "attention" | "positive" | "danger";

const TONE_CLASS: Record<StatusTone, string> = {
  neutral: "border-pt-border bg-pt-bg/80 text-pt-muted",
  attention: "border-pt-gold/35 bg-[rgba(232,196,90,0.08)] text-pt-gold",
  positive: "border-pt-accent/35 bg-[rgba(46,230,160,0.08)] text-pt-accent",
  danger: "border-pt-red/35 bg-[rgba(255,90,95,0.08)] text-pt-red",
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
      "insert",
      "update",
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
    [
      "lost",
      "cancelled",
      "failed",
      "overdue",
      "void",
      "refunded",
      "inactive",
      "delete",
    ].includes(v)
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
    <div className="mb-6 sm:mb-8">
      <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold tracking-tight text-pt-text sm:text-[2rem]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-pt-muted">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1.5 text-[11px] font-semibold tracking-[0.14em] text-pt-gold uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold tracking-tight text-pt-text sm:text-[2rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-pt-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-[family-name:var(--font-archivo)] text-base font-bold tracking-tight text-pt-text sm:text-lg">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-pt-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  href,
  emphasize,
  hint,
}: {
  label: string;
  value: number | string;
  href: string;
  emphasize?: boolean;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className={`admin-kpi block rounded-2xl border p-5 no-underline ${
        emphasize
          ? "border-pt-accent/45 bg-gradient-to-br from-[rgba(46,230,160,0.12)] to-pt-surface"
          : "border-pt-border bg-pt-surface/90 hover:border-pt-accent/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-medium text-pt-muted">{label}</p>
        <span
          aria-hidden
          className={`mt-0.5 text-xs ${emphasize ? "text-pt-accent" : "text-[#4A5470]"}`}
        >
          →
        </span>
      </div>
      <p
        className={`mt-3 font-[family-name:var(--font-archivo)] text-[2rem] leading-none font-extrabold tabular-nums sm:text-3xl ${
          emphasize ? "text-pt-accent" : "text-pt-text"
        }`}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-[11px] tracking-wide text-[#6B7289] uppercase">
          {hint}
        </p>
      ) : null}
    </Link>
  );
}

export function DbError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-pt-red/40 bg-[rgba(255,90,95,0.08)] px-4 py-3 text-sm text-[#FFB4B6]"
    >
      {message}
    </div>
  );
}

export function Flash({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-6 rounded-xl border border-pt-accent/35 bg-[rgba(46,230,160,0.08)] px-4 py-3 text-sm text-pt-accent">
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
    <div className="rounded-2xl border border-dashed border-pt-border bg-pt-surface/60 px-6 py-12 text-center">
      <div
        aria-hidden
        className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-pt-border bg-pt-bg text-pt-accent"
      >
        ◇
      </div>
      <p className="font-[family-name:var(--font-archivo)] text-base font-semibold text-pt-text">
        {heading}
      </p>
      {body ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-pt-muted">
          {body}
        </p>
      ) : null}
      {children ? (
        <div className="mt-5 flex justify-center">{children}</div>
      ) : null}
    </div>
  );
}

export function inputClass() {
  return "admin-input w-full rounded-xl border border-pt-border bg-pt-bg px-3.5 py-2.5 text-sm text-pt-text placeholder:text-[#6B7289] outline-none focus:border-pt-accent";
}

export function labelClass() {
  return "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-pt-muted";
}

export function btnPrimary() {
  return "admin-btn-primary inline-flex min-h-10 items-center justify-center rounded-xl bg-pt-accent px-4 py-2 text-sm font-bold text-pt-bg";
}

export function btnGhost() {
  return "admin-btn-ghost inline-flex min-h-10 items-center justify-center rounded-xl border border-pt-border bg-transparent px-4 py-2 text-sm text-[#C3CADA] hover:border-pt-accent/60 hover:bg-pt-bg hover:text-white";
}

export function cardClass() {
  return "rounded-2xl border border-pt-border bg-pt-surface/95 p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] sm:p-6";
}

export function tableWrap() {
  return "admin-table overflow-x-auto rounded-2xl border border-pt-border bg-pt-surface/95 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]";
}

export function thClass() {
  return "sticky top-0 z-[1] border-b border-[#1A2030] bg-[#0B0E18]/95 px-4 py-3.5 text-left text-[11px] font-semibold tracking-[0.08em] text-pt-muted uppercase backdrop-blur-sm";
}

export function tdClass() {
  return "border-t border-[#1A2030] px-4 py-3.5 text-sm text-[#C3CADA]";
}

export function trClass() {
  return "group hover:bg-[rgba(11,14,24,0.65)]";
}

export function linkClass() {
  return "text-pt-accent no-underline transition-colors hover:text-[#7af2c4]";
}

export function filterChipClass(active: boolean) {
  return `inline-flex min-h-9 items-center rounded-full px-3.5 py-1.5 text-sm no-underline transition ${
    active
      ? "bg-pt-accent font-semibold text-pt-bg shadow-[0_0_0_1px_rgba(46,230,160,0.3)]"
      : "border border-pt-border text-[#C3CADA] hover:border-pt-accent/45 hover:text-pt-text"
  }`;
}

export function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-pt-border bg-pt-surface/50 p-2 sm:mb-6">
      {children}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={`${linkClass()} mb-4 inline-flex min-h-9 items-center gap-1.5 text-sm`}
    >
      <span aria-hidden>←</span> {label}
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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide capitalize ${TONE_CLASS[t]}`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

/** @deprecated Prefer StatusPill — kept for existing call sites */
export function StagePill({ stage }: { stage: string }) {
  return <StatusPill value={stage} />;
}
