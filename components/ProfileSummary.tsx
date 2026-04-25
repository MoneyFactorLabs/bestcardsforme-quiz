import type { QuizAnswers } from "@/types/quiz";

type ProfileSummaryProps = {
  profile: {
    title: string;
    summary: string;
    signals: string[];
  };
  answers: QuizAnswers;
};

export function ProfileSummary({ profile, answers }: ProfileSummaryProps) {
  const loungeCopy =
    answers.loungeAccess === "yes"
      ? "Lounge access is treated as real value only when your travel frequency supports it."
      : answers.loungeAccess === "maybe"
        ? "Lounge access gets partial credit because you said it only matters if the math works."
        : "Premium lounge-heavy cards are discounted because you said lounges are not a priority.";

  return (
    <section className="rounded-lg border border-blue-gray/80 bg-white p-5 shadow-soft sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Your profile</p>
          <h2 className="mt-2 text-2xl font-semibold text-navy sm:text-3xl">{profile.title}</h2>
          <p className="mt-3 text-base leading-7 text-mid-navy/80">{profile.summary}</p>
          <p className="mt-3 text-sm leading-6 text-mid-navy/70">{loungeCopy}</p>
        </div>
        <div className="rounded-md bg-[#f5f8fb] p-4">
          <p className="text-sm font-semibold text-navy">Signals used in your ranking</p>
          <div className="mt-3 grid gap-2">
            {profile.signals.map((signal) => (
              <p key={signal} className="rounded-md border border-blue-gray/60 bg-white px-3 py-2 text-sm text-mid-navy/75">
                {signal}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
