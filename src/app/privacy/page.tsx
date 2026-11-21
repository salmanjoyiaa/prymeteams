import Link from "next/link";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07090F] px-4 py-10 text-[#EEF1F7] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm text-[#9AA3B5] no-underline"
        >
          ← Home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-archivo)] text-3xl font-black sm:mt-6 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 rounded-xl border border-[#5A1F27] bg-[#130B0E] px-4 py-3 text-sm text-[#FF5A5F]">
          Legal content pending — replace this placeholder before public launch.
        </p>
        <p className="mt-6 text-[#9AA3B5] leading-relaxed">
          This page will describe how Pryme Teams collects, uses, and protects
          personal information submitted through the website and admin systems.
        </p>
      </div>
    </main>
  );
}
