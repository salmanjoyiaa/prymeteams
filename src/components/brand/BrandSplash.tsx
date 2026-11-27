"use client";

import { useEffect, useState } from "react";

export const SPLASH_STORAGE_KEY = "pt-splash-seen";
export const SPLASH_SKIP_CLASS = "pt-splash-skip";

const MIN_MS = 1600;
const EXIT_MS = 480;

/**
 * Server-renders the splash immediately so the homepage never flashes first.
 * A blocking inline script in root layout adds `pt-splash-skip` before paint
 * when the session has already seen the splash.
 */
export function BrandSplash() {
  const [phase, setPhase] = useState<"show" | "exit" | "gone">("show");

  useEffect(() => {
    const skip =
      document.documentElement.classList.contains(SPLASH_SKIP_CLASS) ||
      (() => {
        try {
          return sessionStorage.getItem(SPLASH_STORAGE_KEY) === "1";
        } catch {
          return false;
        }
      })();

    if (skip) {
      document.documentElement.classList.add(SPLASH_SKIP_CLASS);
      setPhase("gone");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 350 : MIN_MS;

    const exitTimer = window.setTimeout(() => setPhase("exit"), hold);
    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_STORAGE_KEY, "1");
      } catch {
        /* private mode */
      }
      document.documentElement.classList.add(SPLASH_SKIP_CLASS);
      setPhase("gone");
    }, hold + (reduced ? 0 : EXIT_MS));

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`pt-splash${phase === "exit" ? " pt-splash--exit" : ""}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="pt-splash-inner">
        <img
          src="/brand/pryme-logo-full-on-dark.png"
          alt=""
          className="pt-splash-logo"
          width={1600}
          height={794}
          decoding="async"
          fetchPriority="high"
        />
        <span className="pt-splash-line" />
      </div>
    </div>
  );
}
