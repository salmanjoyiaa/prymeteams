"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

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

function navActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
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
    <div className="flex min-h-screen bg-pt-bg text-pt-text">
      <aside className="relative hidden w-56 shrink-0 border-r border-[#1A2030] bg-[#0B0E18] md:flex md:flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pt-accent/40 to-transparent"
        />
        <div className="flex flex-1 flex-col p-4">
          <p className="mb-6 font-[family-name:var(--font-archivo)] text-sm font-extrabold tracking-wide text-pt-gold">
            PRYME <span className="text-pt-text">ADMIN</span>
          </p>
          <nav className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-lg px-3 py-2 text-sm no-underline transition ${
                    active
                      ? "bg-pt-surface font-medium text-pt-text"
                      : "text-[#C3CADA] hover:bg-pt-surface hover:text-white"
                  }`}
                >
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-pt-accent"
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-[#1A2030] pt-4">
            <p className="truncate text-xs text-[#8A93A6]">{email}</p>
            <form action="/admin/logout" method="post" className="mt-2">
              <button
                type="submit"
                className="text-xs text-pt-red hover:underline"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        {/* Mobile top header — single row brand + menu */}
        <header className="sticky top-0 z-30 border-b border-[#1A2030] bg-[#0B0E18]/95 backdrop-blur-md md:hidden">
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <p className="min-w-0 truncate font-[family-name:var(--font-archivo)] text-sm font-extrabold tracking-wide text-pt-gold">
              PRYME <span className="text-pt-text">ADMIN</span>
            </p>
            <div className="flex shrink-0 items-center gap-2">
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
              className="max-h-[70vh] overflow-y-auto border-t border-[#1A2030] px-3 py-2"
              aria-label="Admin"
            >
              {NAV.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mb-1 flex min-h-11 items-center rounded-lg px-3 text-sm no-underline ${
                      active
                        ? "bg-pt-accent font-semibold text-pt-bg"
                        : "text-[#C3CADA]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <p className="mt-2 truncate px-3 pb-2 text-xs text-[#8A93A6]">
                {email}
              </p>
            </nav>
          ) : null}
        </header>

        <main className="relative flex-1 px-4 py-5 sm:p-6 md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pt-gold/20 to-transparent md:via-pt-accent/15"
          />
          {children}
        </main>
      </div>
    </div>
  );
}
