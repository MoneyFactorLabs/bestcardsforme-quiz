import Link from "next/link";
import { loungeNetworks, loungePolicies } from "@/data/loungePolicies";
import { authorizedUsersText, freeGuestsText, guestFeeText, visitsText } from "@/lib/loungeFormat";
import { groupByNetwork } from "@/lib/loungeModel";

const kindLabel = { issuer: "Card issuer lounge", "priority-pass": "Lounge membership network", airline: "Airline lounge", partner: "Partner lounge" } as const;
const link = "font-semibold text-navy underline decoration-accent/70 underline-offset-4 hover:text-mid-navy";

// Lounge-first view built from the same policy rows as the card-first table and the calculator.
export function LoungeNetworkGuide() {
  const groups = groupByNetwork(loungePolicies, loungeNetworks);
  const covered = loungePolicies.map((policy) => policy.cardName);
  return (
    <section aria-labelledby="network-guide-heading" className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6">
      <h2 id="network-guide-heading" className="text-2xl font-semibold text-navy">Which cards get you into each lounge?</h2>
      <p className="mt-3 text-base leading-7 text-mid-navy/85" data-testid="network-guide-scope">
        <strong>Covers only the {covered.length} cards we have verified so far:</strong> {covered.join(", ")}. Other cards also reach some of these
        lounges; this is not a complete list of eligible cards.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {groups.map(({ network, cards }) => (
          <article key={network.id} className="rounded-lg border border-blue-gray/70 p-4" data-testid={`network-${network.id}`} aria-labelledby={`network-${network.id}-name`}>
            <h3 id={`network-${network.id}-name`} className="text-lg font-semibold text-navy">{network.name}</h3>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-ink">{kindLabel[network.kind]}</p>
            <p className="mt-1 text-sm text-mid-navy/75">
              {cards.length === 1 ? "1 of the covered cards" : `${cards.length} of the covered cards`}
            </p>
            <ul className="mt-3 grid gap-3">
              {cards.map(({ policy, access }) => (
                <li key={policy.cardSlug} className="rounded-md bg-blue-gray/15 p-3">
                  <Link href={`/cards/${policy.cardSlug}`} className={link}>{policy.cardName}</Link>
                  <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                    <dt className="text-mid-navy/75">Free guests</dt>
                    <dd className="text-navy">{freeGuestsText(access)}</dd>
                    <dt className="text-mid-navy/75">Extra guest</dt>
                    <dd className="text-navy">{guestFeeText(access)}</dd>
                    <dt className="text-mid-navy/75">Visits</dt>
                    <dd className="text-navy">{visitsText(access)}</dd>
                    <dt className="text-mid-navy/75">Authorized users</dt>
                    <dd className="text-navy">{authorizedUsersText(access)}</dd>
                  </dl>
                  {access.restrictions.length ? (
                    <details className="mt-2 text-sm" open={network.kind === "airline"}>
                      <summary className="cursor-pointer font-semibold text-navy">Restrictions ({access.restrictions.length})</summary>
                      <ul className="mt-2 grid list-disc gap-1 pl-5 leading-6 text-mid-navy/85">
                        {access.restrictions.map((restriction) => (
                          <li key={restriction.claim + restriction.text}>{restriction.text}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
