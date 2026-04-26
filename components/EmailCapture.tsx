import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export function EmailCapture() {
  return (
    <section className="overflow-hidden rounded-lg bg-navy text-white shadow-soft">
      <div className="border-b border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-blue-gray sm:px-7">
        Premium report preview
      </div>
      <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Detailed comparison</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
            Want the full honest-math comparison and today's strongest public offers?
          </h2>
          <p className="mt-3 text-sm leading-6 text-blue-gray">
            Get the side-by-side value logic, offer-check reminders, and the caveats that matter
            before you apply.
          </p>
        </div>
        <LeadCaptureForm
          sourcePage="quiz_results"
          inputId="quiz-report-email"
          buttonLabel="Send me the detailed comparison"
          successMessage="You're on the list. We'll send the detailed comparison when the next report update is available."
        />
      </div>
    </section>
  );
}
