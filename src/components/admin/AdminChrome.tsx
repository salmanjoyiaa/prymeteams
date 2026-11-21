import Link from "next/link";

export function PageTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-[family-name:var(--font-archivo)] text-3xl font-extrabold text-[#EEF1F7]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-[#9AA3B5]">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function DbError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-[#FF5A5F]/50 bg-[#1E2436] px-4 py-3 text-sm text-[#FFB4B6]"
    >
      {message}
    </div>
  );
}

export function Flash({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-6 rounded-xl border border-[#2EE6A0]/40 bg-[#0F1320] px-4 py-3 text-sm text-[#2EE6A0]">
      {message}
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <p className="rounded-xl border border-dashed border-[#1E2436] bg-[#0F1320] px-4 py-8 text-center text-sm text-[#8A93A6]">
      No {label} yet. Use the form below to add the first one.
    </p>
  );
}

export function inputClass() {
  return "w-full rounded-lg border border-[#1E2436] bg-[#07090F] px-3 py-2 text-sm text-[#EEF1F7] placeholder:text-[#6B7289] focus:border-[#2EE6A0] focus:outline-none";
}

export function labelClass() {
  return "mb-1 block text-xs font-medium uppercase tracking-wide text-[#9AA3B5]";
}

export function btnPrimary() {
  return "rounded-lg bg-[#2EE6A0] px-4 py-2 text-sm font-semibold text-[#07090F] hover:brightness-110";
}

export function btnGhost() {
  return "rounded-lg border border-[#1E2436] px-4 py-2 text-sm text-[#C3CADA] hover:border-[#2EE6A0] hover:text-white";
}

export function cardClass() {
  return "rounded-2xl border border-[#1E2436] bg-[#0F1320] p-5";
}

export function tableWrap() {
  return "overflow-x-auto rounded-2xl border border-[#1E2436] bg-[#0F1320]";
}

export function thClass() {
  return "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#9AA3B5]";
}

export function tdClass() {
  return "border-t border-[#1A2030] px-4 py-3 text-sm text-[#C3CADA]";
}

export function linkClass() {
  return "text-[#2EE6A0] no-underline hover:underline";
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={`${linkClass()} mb-4 inline-block text-sm`}>
      ← {label}
    </Link>
  );
}

export function StagePill({ stage }: { stage: string }) {
  return (
    <span className="inline-block rounded-full border border-[#1E2436] bg-[#07090F] px-2 py-0.5 text-xs text-[#E8C45A]">
      {stage.replace(/_/g, " ")}
    </span>
  );
}