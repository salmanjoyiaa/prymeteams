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
    <main className="min-h-screen bg-pt-bg px-4 py-8 text-pt-text sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-pt-muted no-underline hover:text-pt-accent"
        >
          ← Back to Pryme Teams
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-archivo)] text-[1.75rem] leading-tight font-black tracking-tight sm:mt-6 sm:text-5xl">
          Get my <span className="text-pt-accent">quote</span>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-pt-muted sm:mt-4 sm:text-lg">
          Tell us what you need — one expert or a full team — and we&apos;ll
          come back with a plan and a custom price.
        </p>
        <div className="relative mt-6 rounded-2xl border border-pt-border bg-[#0B0E18] p-4 sm:mt-10 sm:rounded-3xl sm:p-8">
          <RequestForm plan={plan} intent={intent} />
        </div>
      </div>
    </main>
  );
}
