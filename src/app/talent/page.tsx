import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Talent",
  description: "Approved Pryme Teams Customer Success Experts.",
};

type PublicTalent = {
  id: string;
  display_name: string;
  title: string | null;
  bio: string | null;
  skills: string[] | null;
  years_experience: number | null;
};

export default async function TalentPage() {
  let talent: PublicTalent[] = [];
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from("public_talent")
      .select("id, display_name, title, bio, skills, years_experience")
      .order("display_name");
    talent = (data as PublicTalent[] | null) ?? [];
  }

  return (
    <main className="min-h-screen bg-[#07090F] px-4 py-10 text-[#EEF1F7] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1240px]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[#9AA3B5] no-underline hover:text-[#2EE6A0]"
        >
          ← Home
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-archivo)] text-3xl font-black tracking-tight sm:mt-6 sm:text-6xl">
          Our experts
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[#9AA3B5]">
          Only approved profiles are listed here. Pryme Teams is a managed
          service — not a self-serve freelancer marketplace.
        </p>
        {talent.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-[#1E2436] bg-[#0F1320] p-10 text-[#9AA3B5]">
            No public talent profiles yet. Check back soon, or{" "}
            <Link href="/request" className="text-[#2EE6A0]">
              request a team
            </Link>
            .
          </div>
        ) : (
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {talent.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-[#1E2436] bg-[#0F1320] p-6"
              >
                <h2 className="font-[family-name:var(--font-archivo)] text-xl font-extrabold">
                  {t.display_name}
                </h2>
                {t.title ? (
                  <p className="mt-1 text-sm text-[#2EE6A0]">{t.title}</p>
                ) : null}
                {t.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-[#9AA3B5]">
                    {t.bio}
                  </p>
                ) : null}
                {t.skills?.length ? (
                  <p className="mt-3 text-xs text-[#8A93A6]">
                    {t.skills.join(" · ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
