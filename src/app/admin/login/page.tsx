"use client";

import Link from "next/link";
import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/supabase/env";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const urlError = params.get("error");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!hasSupabaseEnv()) {
      setError("Supabase is not configured. Add env vars first.");
      return;
    }
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error: signError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signError) {
          setError(signError.message);
          return;
        }
        router.replace("/admin");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl border border-[#1E2436] bg-[#0F1320]/95 p-5 shadow-[0_24px_80px_-40px_rgba(46,230,160,0.35)] backdrop-blur-sm sm:p-8"
    >
      <div>
        <BrandLogo size="admin" className="mb-4" />
        <h1 className="mt-2 font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#EEF1F7]">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-[#9AA3B5]">
          Use the email and password from your Supabase Auth admin user.
        </p>
      </div>
      {(error || urlError) && (
        <p className="rounded-lg bg-[#130B0E] px-3 py-2 text-sm text-[#FF5A5F]">
          {error ||
            (urlError === "forbidden"
              ? "This account is not an admin."
              : urlError === "not_configured"
                ? "Supabase is not configured."
                : "Please sign in.")}
        </p>
      )}
      <div>
        <label className="mb-2 block text-sm text-[#9AA3B5]" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-[#1E2436] bg-[#07090F] px-4 py-3 text-[#EEF1F7] outline-none focus:border-[#2EE6A0]"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm text-[#9AA3B5]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-[#1E2436] bg-[#07090F] px-4 py-3 text-[#EEF1F7] outline-none focus:border-[#2EE6A0]"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="pt-btn min-h-11 w-full rounded-xl bg-[#2EE6A0] py-3 font-[family-name:var(--font-archivo)] text-base font-extrabold text-[#07090F] disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#07090F] px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 10%, rgba(46,230,160,0.12), transparent 45%), radial-gradient(ellipse at 80% 90%, rgba(232,196,90,0.08), transparent 40%)",
        }}
      />
      <div className="relative z-10 mb-6 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[#9AA3B5] no-underline hover:text-[#2EE6A0]"
        >
          ← Back to site
        </Link>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
