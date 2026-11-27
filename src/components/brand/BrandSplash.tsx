"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pt-splash-seen";
const MIN_MS = 1500;
const EXIT_MS = 420;

export function BrandSplash() {
  const [phase, setPhase] = useState<"boot" | "show" | "exit" | "gone">(
    "boot",
  );

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setPhase("gone");
        return;
      }
    } catch {
      /* private mode */
    }

    setPhase("show");
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 400 : MIN_MS;

    const exitTimer = window.setTimeout(() => {
      setPhase("exit");
    }, hold);

    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("gone");
    }, hold + (reduced ? 0 : EXIT_MS));

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "boot" || phase === "gone") return null;

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
        />
        <span className="pt-splash-line" />
      </div>
    </div>
  );
}
