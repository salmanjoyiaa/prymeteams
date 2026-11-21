"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatNow() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Visitor-local clock for the sample office-floor camera HUD. */
export function LiveClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    setTime(formatNow());
    const id = window.setInterval(() => setTime(formatNow()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span id="pt-clock">{time}</span>;
}
