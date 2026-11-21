"use client";

import { useEffect } from "react";
import type { CallSettings } from "@/lib/settings";

function telHref(n: string) {
  return `tel:${String(n).replace(/[^+0-9]/g, "")}`;
}

function isOpenNow(config: CallSettings) {
  if (typeof window === "undefined") return true;
  const q = new URLSearchParams(window.location.search).get("call");
  if (q === "open") return true;
  if (q === "after") return false;
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: config.timeZone,
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const wd = parts.find((x) => x.type === "weekday")?.value;
    const hr =
      parseInt(parts.find((x) => x.type === "hour")?.value ?? "0", 10) % 24;
    const dayOk = config.openWeekends || (wd !== "Sat" && wd !== "Sun");
    return dayOk && hr >= config.openHour && hr < config.closeHour;
  } catch {
    return true;
  }
}

/**
 * Mirrors handoff PRYME_CALL: toggles pt-if blocks, tel links, and labels.
 * Preview with ?call=open or ?call=after.
 */
export function CallController({ config }: { config: CallSettings }) {
  useEffect(() => {
    let popupOpen = false;

    const render = () => {
      const open = isOpenNow(config);
      document.querySelectorAll("[data-pt-if]").forEach((el) => {
        const w = el.getAttribute("data-when");
        let show = true;
        if (w === "open") show = open;
        else if (w === "after") show = !open;
        else if (w === "popup-open") show = popupOpen;
        else if (w === "popup-closed") show = !popupOpen;
        (el as HTMLElement).hidden = !show;
      });
      document.querySelectorAll("[data-tel]").forEach((a) => {
        a.setAttribute("href", telHref(open ? config.phone : config.afterPhone));
      });
      document.querySelectorAll("[data-text]").forEach((el) => {
        const key = el.getAttribute("data-text") as keyof CallSettings | null;
        if (!key) return;
        const value = config[key];
        if (typeof value === "string") el.textContent = value;
      });
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const btn = t?.closest?.('[data-action="toggle-call"]');
      if (btn) {
        popupOpen = !popupOpen;
        render();
      }
    };

    document.addEventListener("click", onClick);
    render();
    const timer = window.setInterval(render, 30_000);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearInterval(timer);
    };
  }, [config]);

  return null;
}
