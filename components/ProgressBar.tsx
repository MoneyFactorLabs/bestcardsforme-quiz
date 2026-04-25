type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div aria-label={`Question ${currentStep} of ${totalSteps}`} className="w-full">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold text-mid-navy/70">
        <span>
          Question {currentStep} of {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-blue-gray/55">
        <div
          className="h-2 rounded-full bg-gold transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
