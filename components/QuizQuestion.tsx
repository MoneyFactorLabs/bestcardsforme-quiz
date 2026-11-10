import type { QuizQuestionDefinition } from "@/types/quiz";

type QuizQuestionProps = {
  question: QuizQuestionDefinition;
  selectedValue?: string;
  onSelect: (value: string) => void;
};

export function QuizQuestion({ question, selectedValue, onSelect }: QuizQuestionProps) {
  return (
    <fieldset className="space-y-6">
      <div>
        <legend className="text-sm font-semibold text-accent-ink">{question.eyebrow}</legend>
        <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-navy sm:text-[2rem]">{question.question}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              aria-pressed={isSelected}
              className={`focus-ring flex min-h-16 items-center justify-between gap-3 rounded-lg border px-5 py-4 text-left text-base font-semibold transition ${
                isSelected
                  ? "border-navy bg-navy text-white shadow-card"
                  : "border-line bg-white text-navy hover:border-navy/50 hover:bg-surface"
              }`}
            >
              <span>{option.label}</span>
              <span
                aria-hidden="true"
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ? "border-accent bg-accent text-navy" : "border-line bg-white"
                }`}
              >
                {isSelected ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path fill="currentColor" d="M6.2 11.4 2.8 8l1.1-1.1 2.3 2.3 5.9-5.9 1.1 1.1z" />
                  </svg>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
