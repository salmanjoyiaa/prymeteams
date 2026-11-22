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

function setShown(el: HTMLElement, show: boolean) {
  // display:contents + hidden is unreliable in some browsers (children still paint).
  // Always set display with !important so it wins over default CSS hide rules.
  if (show) {
    el.removeAttribute("hidden");
    el.classList.remove("pt-if-hide");
    el.classList.add("pt-if-show");
    el.style.setProperty("display", "contents", "important");
  } else {
    el.setAttribute("hidden", "");
    el.classList.add("pt-if-hide");
    el.classList.remove("pt-if-show");
    el.style.setProperty("display", "none", "important");
  }
}

/**
 * Mirrors handoff PRYME_CALL: toggles data-pt-if blocks, tel links, and labels.
 * Preview with ?call=open or ?call=after.
 */
export function CallController({ config }: { config: CallSettings }) {
  const {
    phone,
    afterPhone,
    hoursLabel,
    timeZone,
    openHour,
    closeHour,
    openWeekends,
  } = config;

  useEffect(() => {
    let popupOpen = false;
    const live: CallSettings = {
      phone,
      afterPhone,
      hoursLabel,
      timeZone,
      openHour,
      closeHour,
      openWeekends,
    };

    const render = () => {
      const open = isOpenNow(live);
      document.querySelectorAll<HTMLElement>("[data-pt-if]").forEach((el) => {
        const w = el.getAttribute("data-when");
        let show = true;
        if (w === "open") show = open;
        else if (w === "after") show = !open;
        else if (w === "popup-open") show = popupOpen;
        else if (w === "popup-closed") show = !popupOpen;
        setShown(el, show);
      });
      document.querySelectorAll("[data-tel]").forEach((a) => {
        a.setAttribute(
          "href",
          telHref(open ? live.phone : live.afterPhone),
        );
      });
      document.querySelectorAll("[data-text]").forEach((el) => {
        const key = el.getAttribute("data-text") as keyof CallSettings | null;
        if (!key) return;
        const value = live[key];
        if (typeof value === "string") el.textContent = value;
      });
    };

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const btn = t?.closest?.('[data-action="toggle-call"]');
      if (btn) {
        e.preventDefault();
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
  }, [
    phone,
    afterPhone,
    hoursLabel,
    timeZone,
    openHour,
    closeHour,
    openWeekends,
  ]);

  return null;
}
