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
    <details className="group rounded-xl border border-line bg-white shadow-card">
      <summary className="focus-ring flex cursor-pointer items-center justify-between gap-3 rounded-xl px-5 py-4 sm:px-6">
        <span>
          <span className="block text-sm font-semibold text-accent-ink">How we read your answers</span>
          <span className="mt-0.5 block text-lg font-semibold text-navy">{profile.title}</span>
        </span>
        <span aria-hidden="true" className="text-sm font-semibold text-mid-navy transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="grid gap-5 border-t border-line px-5 py-5 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-base leading-7 text-mid-navy/85">{profile.summary}</p>
          <p className="mt-3 text-sm leading-6 text-mid-navy/70">{loungeCopy}</p>
          <p className="mt-3 text-sm leading-6 text-mid-navy/70">
            Every card is weighed on your stated goal, its value after the annual fee, and the perks you are likely to use.
          </p>
        </div>
        <div className="rounded-lg bg-surface p-4">
          <p className="text-sm font-semibold text-navy">Signals used in your ranking</p>
          <ul className="mt-3 grid gap-2">
            {profile.signals.map((signal) => (
              <li key={signal} className="rounded-md border border-line bg-white px-3 py-2 text-sm text-mid-navy/80">
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}
