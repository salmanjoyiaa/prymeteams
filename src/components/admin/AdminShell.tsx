import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/talent", label: "Talent" },
  { href: "/admin/job-requests", label: "Job requests" },
  { href: "/admin/placements", label: "Placements" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/finance", label: "Finance" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#07090F] text-[#EEF1F7]">
      <aside className="hidden w-56 shrink-0 border-r border-[#1A2030] bg-[#0B0E18] p-4 md:block">
        <p className="mb-6 font-[family-name:var(--font-archivo)] text-sm font-extrabold tracking-wide text-[#E8C45A]">
          PRYME <span className="text-[#EEF1F7]">ADMIN</span>
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-[#C3CADA] no-underline hover:bg-[#0F1320] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 truncate text-xs text-[#8A93A6]">{email}</p>
        <form action="/admin/logout" method="post" className="mt-2">
          <button
            type="submit"
            className="text-xs text-[#FF5A5F] hover:underline"
          >
            Sign out
          </button>
        </form>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <div className="border-b border-[#1A2030] px-4 py-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <p className="font-[family-name:var(--font-archivo)] text-sm font-extrabold tracking-wide text-[#E8C45A]">
              PRYME <span className="text-[#EEF1F7]">ADMIN</span>
            </p>
            <form action="/admin/logout" method="post">
              <button
                type="submit"
                className="min-h-11 px-2 text-xs text-[#FF5A5F]"
              >
                Sign out
              </button>
            </form>
          </div>
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto pb-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 shrink-0 items-center rounded-md border border-[#1E2436] px-3 text-xs text-[#C3CADA] no-underline whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
