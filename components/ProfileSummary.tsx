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
      ? "Lounge access is counted only where your travel pattern can turn it into real value."
      : answers.loungeAccess === "maybe"
        ? "Lounge access receives partial credit because you only value it when the math holds."
        : "Lounge-heavy cards are discounted because that benefit is not central to your profile.";

  return (
    <section className="overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
      <div className="grid gap-px bg-blue-gray/70 sm:grid-cols-3">
        {[
          ["Primary lens", "Your stated goal"],
          ["Fee lens", "Annual value after friction"],
          ["Usage lens", "Perks you are likely to use"],
        ].map(([label, value]) => (
          <div key={label} className="bg-[#f8fafc] px-5 py-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-mid-navy/55">
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-navy">{value}</p>
          </div>
        ))}
      </div>
      <div className="p-5 sm:p-6">
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
      </div>
    </section>
  );
}
