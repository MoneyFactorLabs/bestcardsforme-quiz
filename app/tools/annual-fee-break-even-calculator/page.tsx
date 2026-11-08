import type { Metadata } from "next";
import Link from "next/link";
import { FeeBreakEvenCalculator } from "@/components/FeeBreakEvenCalculator";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { TERMS_CHECKED_AT } from "@/data/walletScenarios";
import { absoluteUrl } from "@/lib/site";

const PATH = "/tools/annual-fee-break-even-calculator";
const TITLE = "Annual Fee Break-Even Calculator";
const DESCRIPTION =
  "Enter your spend, earn rates and the credits you would really use to see whether a card's annual fee beats a no-fee 2% card, and where it breaks even.";

export const metadata: Metadata = {
  title: `${TITLE} | BestCardsForMe`,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), type: "website" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: TITLE,
  url: absoluteUrl(PATH),
  description: DESCRIPTION,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", name: "BestCardsForMe", url: absoluteUrl("/") },
};

const linkClass = "font-bold text-navy underline decoration-gold/70 underline-offset-4 hover:text-mid-navy";

export default function AnnualFeeBreakEvenCalculatorPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <JsonLd data={structuredData} />
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-8 sm:pt-12">
        <header className="rounded-lg border border-blue-gray/70 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Calculator</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.15] text-navy sm:text-5xl">{TITLE}</h1>
          <p className="mt-4 text-base leading-8 text-mid-navy/75 sm:text-lg">
            A card with an annual fee is only worth it if it leaves you with more than a no-fee card earning 2% on everything.
            This calculator runs the same Year-2 math as our card reviews (no welcome bonus) on your numbers, and shows how
            much spend or how many credits it takes to break even.
          </p>
        </header>

        <div className="mt-6">
          <FeeBreakEvenCalculator />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded-lg border border-blue-gray/70 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-navy">How the math works</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-base leading-7 text-mid-navy/85">
              <li>Rewards = spend × earn rate × your value per point. A 4x card at 1.7¢ a point earns 6.8% back.</li>
              <li>Net = rewards + credits you would use anyway − the annual fee.</li>
              <li>The comparison is the same total spend on a $0-fee card at 2%, our baseline everywhere on the site.</li>
              <li>
                Credits needed = the baseline minus your rewards plus the fee: the dollar amount of credits the card has to
                deliver before it ties the 2% card.
              </li>
              <li>
                Bonus-spend tie point = the fee, less credits and any margin on other spend, divided by how much each bonus
                dollar beats 2%. If the bonus rate does not beat 2% at your point value, no spend level breaks even.
              </li>
            </ul>
          </section>
          <section className="rounded-lg border border-blue-gray/70 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-navy">What it leaves out</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-base leading-7 text-mid-navy/85">
              <li>Welcome bonuses. They pay for Year 1, not the years you keep the card.</li>
              <li>Spending caps beyond what you enter: put only capped-eligible spend in the bonus row.</li>
              <li>Foreign transaction fees, interest and the value of protections or status.</li>
              <li>
                Point values are estimates. Our defaults are in the{" "}
                <Link href="/methodology" className={linkClass}>methodology</Link>; enter 1¢ if you will cash points out.
              </li>
              <li>Preset fees and earn rates were last checked against issuer pages on {TERMS_CHECKED_AT}. Confirm terms with the issuer before you apply.</li>
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-blue-gray/70 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-navy">Worked comparisons that use this math</h2>
          <ul className="mt-3 grid gap-2 text-base leading-7 text-mid-navy/85">
            <li><Link href="/articles/capital-one-venture-x-vs-amex-platinum-2026" className={linkClass}>Venture X vs Amex Platinum</Link></li>
            <li><Link href="/articles/amex-gold-vs-chase-sapphire-reserve-2026" className={linkClass}>Amex Gold vs Chase Sapphire Reserve</Link></li>
            <li><Link href="/articles/ink-business-preferred-vs-spark-cash-plus-2026" className={linkClass}>Ink Business Preferred vs Spark Cash Plus</Link></li>
            <li><Link href="/articles/personal-vs-business-credit-card-for-business-spending-2026" className={linkClass}>Personal vs business card for business spending</Link></li>
          </ul>
          <p className="mt-4 text-base leading-7 text-mid-navy/85">
            Not sure which card to test? <Link href="/" className={linkClass}>Take the quiz</Link> for a shortlist
            matched to your spending. We earn commissions from some issuers, but payouts never change the math or the
            ranking; see our <Link href="/affiliate-disclosure" className={linkClass}>affiliate disclosure</Link>.
          </p>
        </section>
      </section>
      <Footer />
    </main>
  );
}
