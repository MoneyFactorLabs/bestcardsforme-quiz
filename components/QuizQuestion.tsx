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
        <legend className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
          {question.eyebrow}
        </legend>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy sm:text-3xl">
          {question.question}
        </h2>
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
              className={`focus-ring min-h-16 rounded-md border px-5 py-4 text-left text-base font-semibold transition ${
                isSelected
                  ? "border-gold bg-gold/15 text-navy shadow-soft"
                  : "border-blue-gray bg-white text-mid-navy hover:border-gold hover:bg-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
