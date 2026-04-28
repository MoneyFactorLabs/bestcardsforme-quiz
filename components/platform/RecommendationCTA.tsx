import Link from "next/link";

export type RecommendationCTAProps = {
  eyebrow?: string;
  productName: string;
  whyWeLikeIt: string;
  annualFee?: string;
  bestFor?: string;
  buttonLabel?: string;
  href?: string;
  disclosure?: string;
};

export function RecommendationCTA({
  eyebrow = "BestCardsForMe pick",
  productName,
  whyWeLikeIt,
  annualFee,
  bestFor,
  buttonLabel = "Apply Now",
  href = "#",
  disclosure,
}: RecommendationCTAProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-gray/80 bg-white shadow-soft">
      <div className="bg-navy px-5 py-5 text-white sm:px-7">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold">{productName}</h2>
      </div>
      {(annualFee || bestFor) && (
        <div className="grid gap-px bg-blue-gray/70 sm:grid-cols-2">
          {annualFee && (
            <div className="bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/55">
                Annual fee
              </p>
              <p className="mt-2 text-xl font-bold text-navy">{annualFee}</p>
            </div>
          )}
          {bestFor && (
            <div className="bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-mid-navy/55">
                Best for
              </p>
              <p className="mt-2 text-base font-bold leading-6 text-navy">{bestFor}</p>
            </div>
          )}
        </div>
      )}
      <div className="p-5 sm:p-7">
        <p className="text-sm font-medium leading-7 text-mid-navy/90">{whyWeLikeIt}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={href}
            className="focus-ring rounded-md bg-gold px-5 py-3 text-center text-sm font-bold text-navy transition hover:bg-[#caa42f]"
          >
            {buttonLabel}
          </Link>
          <p className="text-xs font-medium leading-5 text-mid-navy/60">
            {disclosure ||
              "This module is a placeholder for future monetization. BestCardsForMe may receive compensation from partners, but recommendations are driven by fit, net value, and editorial review."}
          </p>
        </div>
      </div>
    </section>
  );
}
