"use client";

import { useEffect, useId, useState } from "react";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#live", label: "Live view" },
  { href: "/#included", label: "What you get" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      const root = document.getElementById(panelId)?.parentElement;
      if (root && t && !root.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, panelId]);

  return (
    <div className="pt-mobile-nav">
      <button
        type="button"
        className="pt-mobile-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span aria-hidden="true" style={{ display: "block", lineHeight: 1 }}>
          {open ? "✕" : "☰"}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          className="pt-mobile-panel"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="/#live" onClick={() => setOpen(false)}>
            Watch live
          </a>
          <a
            className="pt-mobile-cta"
            href="/request"
            onClick={() => setOpen(false)}
          >
            Get a team →
          </a>
        </div>
      ) : null}
    </div>
  );
}
