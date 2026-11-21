import Link from "next/link";
import { RequestForm } from "@/components/request/RequestForm";

export const metadata = {
  title: "Get a quote",
  description: "Request a dedicated Customer Success Expert or team.",
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const plan = typeof sp.plan === "string" ? sp.plan : null;
  const intent = typeof sp.intent === "string" ? sp.intent : null;

  return (
    <main className="min-h-screen bg-[#07090F] px-4 py-10 text-[#EEF1F7] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[#9AA3B5] no-underline hover:text-[#2EE6A0]"
        >
          ← Back to Pryme Teams
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-archivo)] text-3xl font-black tracking-tight sm:mt-6 sm:text-5xl">
          Get my <span className="text-[#2EE6A0]">quote</span>
        </h1>
        <p className="mt-3 text-base text-[#9AA3B5] sm:mt-4 sm:text-lg">
          Tell us what you need — one expert or a full team — and we&apos;ll
          come back with a plan and a custom price.
        </p>
        <div className="relative mt-8 rounded-3xl border border-[#1E2436] bg-[#0B0E18] p-5 sm:mt-10 sm:p-8">
          <RequestForm plan={plan} intent={intent} />
        </div>
      </div>
    </main>
  );
}
