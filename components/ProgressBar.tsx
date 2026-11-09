type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-mid-navy/75">
        <span>
          Question <span className="tabular-nums">{currentStep}</span> of <span className="tabular-nums">{totalSteps}</span>
        </span>
        <span className="tabular-nums">{totalSteps - currentStep === 0 ? "Last one" : `${totalSteps - currentStep} to go`}</span>
      </div>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-valuetext={`Question ${currentStep} of ${totalSteps}`}
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <span key={index} className={`h-1.5 rounded-full ${index < currentStep ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
    </div>
  );
}
