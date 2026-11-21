"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leadFormSchema,
  type LeadFormValues,
  planFromQuery,
  intentFromQuery,
} from "@/lib/validation/lead";
import { submitLeadAction } from "@/app/request/actions";

export function RequestForm({
  plan,
  intent,
}: {
  plan?: string | null;
  intent?: string | null;
}) {
  const startedAt = useMemo(() => Date.now(), []);
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      companyName: "",
      phone: "",
      website: "",
      plan: planFromQuery(plan),
      intent: intentFromQuery(intent),
      message: "",
      websiteUrl: "",
      formStartedAt: startedAt,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitLeadAction({
        ...values,
        formStartedAt: startedAt,
      });
      if (result.ok) {
        setDone(true);
        return;
      }
      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([key, msgs]) => {
          form.setError(key as keyof LeadFormValues, {
            message: msgs?.[0] ?? "Invalid",
          });
        });
      }
      setServerError(result.error);
    });
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-[#1E2436] bg-[#0F1320] p-8 text-center">
        <h2 className="font-[family-name:var(--font-archivo)] text-3xl font-extrabold text-[#EEF1F7]">
          Request received
        </h2>
        <p className="mt-3 text-[#9AA3B5]">
          Thanks — we&apos;ll follow up with a plan and a custom quote.
        </p>
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-[#1E2436] bg-[#07090F] px-4 py-3 text-[#EEF1F7] outline-none focus:border-[#2EE6A0]";
  const label = "mb-2 block text-sm font-medium text-[#C3CADA]";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label className={label} htmlFor="fullName">
          Full name
        </label>
        <input id="fullName" className={field} {...form.register("fullName")} />
        {form.formState.errors.fullName ? (
          <p className="mt-1 text-sm text-[#FF5A5F]">
            {form.formState.errors.fullName.message}
          </p>
        ) : null}
      </div>
      <div>
        <label className={label} htmlFor="email">
          Work email
        </label>
        <input
          id="email"
          type="email"
          className={field}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="mt-1 text-sm text-[#FF5A5F]">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="companyName">
            Company (optional)
          </label>
          <input
            id="companyName"
            className={field}
            {...form.register("companyName")}
          />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone (optional)
          </label>
          <input id="phone" className={field} {...form.register("phone")} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="plan">
            Configuration
          </label>
          <select id="plan" className={field} {...form.register("plan")}>
            <option value="unset">Not sure yet</option>
            <option value="solo">Solo Expert</option>
            <option value="team">Dedicated Team</option>
            <option value="round_the_clock">Round-the-Clock</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="intent">
            I want to
          </label>
          <select id="intent" className={field} {...form.register("intent")}>
            <option value="quote">Get a quote</option>
            <option value="discovery">Book a discovery call</option>
            <option value="question">Ask a question</option>
          </select>
        </div>
      </div>
      <div>
        <label className={label} htmlFor="message">
          Tell us what you need
        </label>
        <textarea
          id="message"
          rows={5}
          className={field}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="mt-1 text-sm text-[#FF5A5F]">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>
      {/* honeypot */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="websiteUrl">Website</label>
        <input
          id="websiteUrl"
          tabIndex={-1}
          autoComplete="off"
          {...form.register("websiteUrl")}
        />
      </div>
      {serverError ? (
        <p className="rounded-xl border border-[#5A1F27] bg-[#130B0E] px-4 py-3 text-sm text-[#FF5A5F]">
          {serverError}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="pt-btn w-full rounded-xl bg-[#2EE6A0] px-6 py-4 font-[family-name:var(--font-archivo)] text-base font-extrabold text-[#07090F] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send my request →"}
      </button>
    </form>
  );
}
