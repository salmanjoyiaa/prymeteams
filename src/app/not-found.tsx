import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#07090F] px-5 text-center text-[#EEF1F7]">
      <h1 className="font-[family-name:var(--font-archivo)] text-5xl font-black">
        Page not found
      </h1>
      <Link href="/" className="mt-6 text-[#2EE6A0]">
        Back home
      </Link>
    </main>
  );
}
