"use client";

import { useState, useTransition } from "react";

export type AiKind = "lead_insight" | "job_description" | "talent_bio";

type Props = {
  kind: AiKind;
  label: string;
  /** Element ids to read from the page when generating */
  sourceIds?: Record<string, string>;
  /** Optional static payload (e.g. lead detail) */
  staticPayload?: Record<string, string>;
  /** Fill this textarea/input id with the result when Apply is clicked */
  applyToId?: string;
};

function readSources(sourceIds?: Record<string, string>) {
  const out: Record<string, string> = {};
  if (!sourceIds) return out;
  for (const [key, id] of Object.entries(sourceIds)) {
    const el = document.getElementById(id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null;
    out[key] = el?.value ?? "";
  }
  return out;
}

export function AiAssistPanel({
  kind,
  label,
  sourceIds,
  staticPayload,
  applyToId,
}: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = () => {
    setError(null);
    start(async () => {
      const payload = {
        ...staticPayload,
        ...readSources(sourceIds),
      };
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, payload }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || data.error) {
        setError(data.error || "AI request failed");
        setText("");
        return;
      }
      setText(data.text || "");
    });
  };

  const apply = () => {
    if (!applyToId || !text) return;
    const el = document.getElementById(applyToId) as
      | HTMLTextAreaElement
      | HTMLInputElement
      | null;
    if (el) {
      el.value = text;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  return (
    <div className="rounded-xl border border-[#1E2436] bg-[#0B0E18] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="cursor-pointer rounded-lg border border-[#2EE6A033] bg-[#2EE6A014] px-3 py-1.5 text-xs font-bold tracking-wide text-[#2EE6A0] transition hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Thinking…" : label}
        </button>
        {text && applyToId ? (
          <button
            type="button"
            onClick={apply}
            className="cursor-pointer rounded-lg border border-[#2A3248] px-3 py-1.5 text-xs font-semibold text-[#C3CADA] transition hover:bg-[#121826]"
          >
            Apply to field
          </button>
        ) : null}
        <span className="text-[10px] font-medium tracking-wider text-[#8A93A6] uppercase">
          Groq · Llama 3.3
        </span>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-[#FF8A8E]">{error}</p>
      ) : null}
      {text ? (
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-[#1A2030] bg-[#07090F] p-3 text-xs leading-relaxed text-[#C3CADA]">
          {text}
        </pre>
      ) : null}
    </div>
  );
}
