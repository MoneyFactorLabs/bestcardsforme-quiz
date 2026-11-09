import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { LoungeGuestCalculator } from "@/components/LoungeGuestCalculator";
import { FAMILY_PARTY, LOUNGE_POLICIES_VERIFIED_AT, familyExample, loungePolicies } from "@/data/loungePolicies";
import type { Known, NetworkAccess } from "@/lib/loungeModel";
import { absoluteUrl } from "@/lib/site";
import issuerClaims from "@/quality/issuer-claims.json";

const PATH = "/credit-card-lounge-access";
const TITLE = "Credit Card Lounge Access: Guest Rules and Family Costs Compared";
const SEO_TITLE = "Credit Card Lounge Guest Policies Compared (2026)";
const DESCRIPTION =
  "Guest rules for Sapphire Reserve, Amex Platinum and Venture X lounges, from issuer pages: free guests, guest fees, authorized users, and what a family really pays.";

export const metadata: Metadata = {
  title: `${SEO_TITLE} | BestCardsForMe`,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: { title: SEO_TITLE, description: DESCRIPTION, url: absoluteUrl(PATH), type: "article" },
};

const usd = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;
const show = (value: Known<number>, format = usd) => (value === "unknown" ? "Not published" : format(value));
const guestsText = (network: NetworkAccess) =>
  network.freeGuests === "unknown"
    ? "Not published"
    : `${network.freeGuests}${network.spendUnlock ? ` (${network.spendUnlock.freeGuests} after $${network.spendUnlock.spend.toLocaleString("en-US")} spend)` : ""}`;
const feeText = (network: NetworkAccess) =>
  network.guestFee === "unknown" ? "Not published" : `${usd(network.guestFee)}${network.childGuestFee !== undefined ? ` (${usd(network.childGuestFee)} ages 2-17)` : ""}`;
const auText = (network: NetworkAccess) =>
  network.authorizedUsers === "included" ? "Yes, own access" : network.authorizedUsers === "not-included" ? "No" : "Not stated";

const reserve = loungePolicies.find((policy) => policy.cardSlug === "chase-sapphire-reserve")!;
const platinum = loungePolicies.find((policy) => policy.cardSlug === "amex-platinum")!;
const net = (policy: typeof reserve, id: string) => policy.networks.find((network) => network.id === id)!;
const centurion = net(platinum, "centurion");

type ClaimProducts = Record<string, { claims: { id: string; text: string; url?: string }[]; issuerUrl: string }>;
const claimProducts = issuerClaims.products as unknown as ClaimProducts;
const sourcesFor = (policy: (typeof loungePolicies)[number]) => {
  const ids = [...new Set(policy.networks.flatMap((network) => network.claims))];
  return ids.map((ref) => {
    const [productId, claimId] = ref.split("/");
    const product = claimProducts[productId];
    const claim = product.claims.find((candidate) => candidate.id === claimId)!;
    return { ref, text: claim.text, url: claim.url ?? product.issuerUrl };
  });
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: SEO_TITLE,
  description: DESCRIPTION,
  url: absoluteUrl(PATH),
  dateModified: LOUNGE_POLICIES_VERIFIED_AT,
  author: { "@type": "Person", name: "Tim", jobTitle: "Founder and editor, BestCardsForMe" },
  publisher: { "@type": "Organization", name: "BestCardsForMe", url: absoluteUrl("/") },
};

const link = "font-bold text-navy underline decoration-gold/70 underline-offset-4 hover:text-mid-navy";
const card = "rounded-lg border border-blue-gray/70 bg-white p-6 shadow-soft";
const h2 = "text-2xl font-semibold text-navy";
const p = "mt-3 text-base leading-7 text-mid-navy/85";

export default function LoungeAccessPage() {
  const fx = familyExample();
  const family = FAMILY_PARTY;
  return (
    <main className="min-h-screen">
      <Header />
      <JsonLd data={structuredData} />
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-8 sm:pt-12">
        <header className={`${card} sm:p-8`}>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Lounge access</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.15] text-navy sm:text-5xl">{TITLE}</h1>
          <p className="mt-4 text-base leading-8 text-mid-navy/75 sm:text-lg">
            Every premium card advertises lounge access. What decides the value is who gets in with you, and what each extra person costs. We read
            the issuers&apos; own lounge terms for the Chase Sapphire Reserve, Amex Platinum and Capital One Venture X, and turned them into guest
            costs for your party. Rules last checked against issuer pages on {LOUNGE_POLICIES_VERIFIED_AT}.
          </p>
          <p className="mt-3 text-sm leading-6 text-mid-navy/70">
            By Tim, founder and editor of BestCardsForMe. We may earn compensation from issuers in the future; it never changes the math or the
            ranking. <Link href="/affiliate-disclosure" className={link}>Affiliate disclosure</Link>.
          </p>
        </header>

        <section className={`mt-6 ${card}`}>
          <h2 className={h2}>Quick answer</h2>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-base leading-7 text-mid-navy/85">
            <li>
              <strong>None of these cards offers unlimited free guests.</strong> The most generous published rule is two free guests per card
              member per visit.
            </li>
            <li>
              <strong>Families: the Sapphire Reserve is the only one of the three whose issuer page gives authorized users their own Priority Pass
              access</strong>, each with two free guests. A family of four with one authorized user enters a Priority Pass lounge for{" "}
              {show(fx.reservePriorityPassWithAu.perVisit)}; with no authorized user the third guest costs {show(fx.reservePriorityPass.perVisit)}{" "}
              a visit.
            </li>
            <li>
              <strong>Amex Platinum: Centurion guests are paid</strong>, {show(centurion.guestFee)} each or {usd(centurion.childGuestFee ?? 0)} for ages 2-17, unless the account spends $75,000
              in a calendar year. The same family pays {show(fx.platinumCenturion.perVisit)} per Centurion visit, {show(fx.platinumCenturion75k.perVisit)}{" "}
              after the spend unlock. Priority Pass, Escape and Plaza Premium lounges admit two free guests.
            </li>
            <li>
              <strong>Venture X: two free guests</strong> at Capital One Lounges and its partner network; Capital One&apos;s page does not publish a
              fee for a third guest or authorized-user access.
            </li>
          </ul>
        </section>

        <section className={`mt-6 ${card} overflow-x-auto`}>
          <h2 className={h2}>Guest rules side by side</h2>
          <p className={p}>From each issuer&apos;s own pages. &quot;Not published&quot; means the issuer page we checked does not state it; we do not fill the gap.</p>
          <table className="mt-4 w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Lounge guest rules by card and network</caption>
            <thead>
              <tr className="text-mid-navy/75">
                <th scope="col" className="py-2 pr-3">Card</th>
                <th scope="col" className="py-2 pr-3">Network</th>
                <th scope="col" className="py-2 pr-3">Free guests per member</th>
                <th scope="col" className="py-2 pr-3">Fee per extra guest</th>
                <th scope="col" className="py-2">Authorized users</th>
              </tr>
            </thead>
            <tbody>
              {loungePolicies.flatMap((policy) =>
                policy.networks.map((network, index) => (
                  <tr key={`${policy.cardSlug}-${network.id}`} className="border-t border-blue-gray/50 align-top">
                    <th scope="row" className="py-2 pr-3 font-semibold text-navy">
                      {index === 0 ? <Link href={`/cards/${policy.cardSlug}`} className={link}>{policy.cardName}</Link> : <span className="sr-only">{policy.cardName}</span>}
                      {index === 0 ? <span className="block text-xs font-normal text-mid-navy/70">${policy.annualFee} annual fee</span> : null}
                    </th>
                    <td className="py-2 pr-3 text-navy">
                      {network.name}
                      {typeof network.memberVisits === "number" ? <span className="block text-xs text-mid-navy/70">{network.memberVisits} visits a year</span> : null}
                    </td>
                    <td className="py-2 pr-3">{guestsText(network)}</td>
                    <td className="py-2 pr-3">{feeText(network)}</td>
                    <td className="py-2">{auText(network)}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </section>

        <div className="mt-6">
          <LoungeGuestCalculator />
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className={card}>
            <h2 className={h2}>Credit cards with unlimited guest passes?</h2>
            <p className={p}>
              Not among these three. &quot;Unlimited&quot; in lounge marketing usually describes the cardholder&apos;s own visits, not guests. Each
              card here caps free guests at two per card member per visit, and the Amex Platinum charges for every Centurion guest unless the
              account reaches $75,000 of spend in a calendar year. Individual lounges can also limit or refuse guests when busy.
            </p>
          </section>
          <section className={card}>
            <h2 className={h2}>Best lounge card for families</h2>
            <p className={p}>
              For a family of four ({family.adults} adults, {family.children} children, {family.visitsPerYear} visits a year), with one card member:
            </p>
            <ul className="mt-2 grid list-disc gap-1 pl-5 text-base leading-7 text-mid-navy/85">
              {fx.cheapest.map((result) => (
                <li key={result.policy.cardSlug}>
                  {result.policy.cardName}:{" "}
                  {result.cheapest ? `${usd(result.cheapest.annual)} a year at ${result.cheapest.network.name}` : "no network with a fully published guest fee for this party"}
                </li>
              ))}
            </ul>
            <p className={p}>
              Adding an authorized user to the Reserve takes its Priority Pass cost to {show(fx.reservePriorityPassWithAu.annual)}. Authorized-user
              fees are not part of this comparison; check the issuer&apos;s current fee before adding one.
            </p>
          </section>
          <section className={card}>
            <h2 className={h2}>Priority Pass guest rules by card</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-base leading-7 text-mid-navy/85">
              <li>Sapphire Reserve: two free guests for the primary cardmember and for each authorized user, then {feeText(net(reserve, "priority-pass"))} per guest per visit.</li>
              <li>Amex Platinum: enrollment required; two free guests, then Priority Pass&apos;s own guest fee (Amex does not publish the amount).</li>
              <li>Venture X: enrollment required; two free guests across its 1,300+ lounge network.</li>
            </ul>
          </section>
          <section className={card}>
            <h2 className={h2}>Venture X vs Amex Platinum lounge access</h2>
            <p className={p}>
              The Platinum reaches more lounge types (Centurion, Delta Sky Club on Delta flights, Priority Pass, Escape, Plaza Premium) but charges
              for Centurion and Sky Club guests. Venture X admits two free guests at its lounges for a $395 fee against $895. For the full card math,
              see <Link href="/articles/capital-one-venture-x-vs-amex-platinum-2026" className={link}>Venture X vs Amex Platinum</Link>.
            </p>
          </section>
          <section className={card}>
            <h2 className={h2}>Authorized-user lounge access</h2>
            <p className={p}>
              The Reserve&apos;s terms give authorized users their own Priority Pass membership. Amex admits Additional Platinum Card Members to
              Centurion Lounges on the same guest terms. Capital One&apos;s product page describes lounge access for primary cardholders only and
              does not say what authorized users get.
            </p>
          </section>
          <section className={card}>
            <h2 className={h2}>What this page does not promise</h2>
            <p className={p}>
              A card that lists a lounge network does not guarantee entry at your airport: lounges can be full, some admit no guests, and airline
              clubs need a same-day ticket on that airline. Check the lounge finder for your airport before you plan around it.
            </p>
          </section>
        </div>

        <section className={`mt-6 ${card}`}>
          <h2 className={h2}>Methodology and sources</h2>
          <p className={p}>
            Each rule above is a registered claim checked automatically against the issuer page listed, and re-checked weekly. Guest cost per visit
            = paying guests × the published fee (children&apos;s rate where published); free places go to adults first. Card economics use our{" "}
            <Link href="/methodology" className={link}>Year-2 wallet model</Link> with the card alone. Last verified {LOUNGE_POLICIES_VERIFIED_AT}.
          </p>
          {loungePolicies.map((policy) => (
            <div key={policy.cardSlug} className="mt-4">
              <h3 className="font-semibold text-navy">{policy.cardName}</h3>
              <ul className="mt-1 grid list-disc gap-1 pl-5 text-sm leading-6 text-mid-navy/85">
                {sourcesFor(policy).map((source) => (
                  <li key={source.ref}>
                    {source.text}.{" "}
                    <a href={source.url} className={link} rel="nofollow noopener" target="_blank">Issuer source</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={`mt-6 ${card}`}>
          <h2 className={h2}>Next steps</h2>
          <p className={p}>
            Read the card reviews for the full Year-2 math: <Link href="/cards/chase-sapphire-reserve" className={link}>Sapphire Reserve</Link>,{" "}
            <Link href="/cards/amex-platinum" className={link}>Amex Platinum</Link>, <Link href="/cards/capital-one-venture-x" className={link}>Venture X</Link>.
            Compare <Link href="/articles/amex-platinum-vs-chase-sapphire-reserve-2026" className={link}>Amex Platinum vs Sapphire Reserve</Link>, or{" "}
            <Link href="/" className={link}>take the quiz</Link> for a recommendation built on your own spending.
          </p>
        </section>
      </section>
      <Footer />
    </main>
  );
}
