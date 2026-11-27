"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";

type NavItem = { href: string; label: string };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "CRM",
    items: [
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/companies", label: "Companies" },
    ],
  },
  {
    label: "Delivery",
    items: [
      { href: "/admin/talent", label: "Talent" },
      { href: "/admin/job-requests", label: "Job requests" },
      { href: "/admin/placements", label: "Placements" },
      { href: "/admin/tasks", label: "Tasks" },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/admin/finance", label: "Finance" },
      { href: "/admin/audit", label: "Audit" },
      { href: "/admin/settings", label: "Settings" },
    ],
  },
];

const FLAT_NAV: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

function navActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "mb-7"}>
      <BrandLogo
        size={compact ? "adminCompact" : "admin"}
        alt="Pryme Teams Admin"
      />
      {!compact ? (
        <p className="mt-2 text-[10px] tracking-[0.16em] text-[#6B7289] uppercase">
          Ops console
        </p>
      ) : null}
    </div>
  );
}

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="admin-shell flex min-h-screen text-pt-text">
      <aside className="admin-aside relative hidden w-60 shrink-0 border-r border-[#1A2030] md:flex md:flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pt-accent/35 to-transparent"
        />
        <div className="flex flex-1 flex-col px-3.5 py-5">
          <div className="px-1.5">
            <BrandMark />
          </div>
          <nav className="flex flex-col gap-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-[0.14em] text-[#5B6478] uppercase">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active = navActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`admin-nav-link relative rounded-xl px-3 py-2 text-[13px] no-underline ${
                          active
                            ? "bg-pt-surface font-semibold text-pt-text shadow-[inset_0_0_0_1px_rgba(46,230,160,0.12)]"
                            : "text-[#A8B0C2] hover:bg-pt-surface/70 hover:text-white"
                        }`}
                      >
                        {active ? (
                          <span
                            aria-hidden
                            className="absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-pt-accent"
                          />
                        ) : null}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          <div className="mt-auto border-t border-[#1A2030] px-1.5 pt-4">
            <p className="truncate text-[11px] text-[#8A93A6]">{email}</p>
            <form action="/admin/logout" method="post" className="mt-2">
              <button
                type="submit"
                className="text-xs font-medium text-pt-red/90 transition-colors hover:text-pt-red"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-30 border-b border-[#1A2030] bg-[#0B0E18]/92 backdrop-blur-md md:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <BrandMark compact />
            <div className="flex shrink-0 items-center gap-1.5">
              <form action="/admin/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center px-2 text-xs text-pt-red"
                >
                  Sign out
                </button>
              </form>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-pt-border bg-pt-surface text-pt-text"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="sr-only">
                  {menuOpen ? "Close menu" : "Open menu"}
                </span>
                <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
          {menuOpen ? (
            <nav
              id={menuId}
              className="max-h-[70vh] overflow-y-auto border-t border-[#1A2030] px-3 py-3"
              aria-label="Admin"
            >
              {FLAT_NAV.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mb-1 flex min-h-11 items-center rounded-xl px-3 text-sm no-underline ${
                      active
                        ? "bg-pt-accent font-semibold text-pt-bg"
                        : "text-[#C3CADA]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <p className="mt-2 truncate px-3 pb-1 text-xs text-[#8A93A6]">
                {email}
              </p>
            </nav>
          ) : null}
        </header>

        <main className="relative flex-1 px-4 py-5 sm:p-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
