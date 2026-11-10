"use client";

import { useMemo, useState } from "react";
import { loungePolicies } from "@/data/loungePolicies";
import { cardsFor, householdProfiles, profileSpend } from "@/data/walletScenarios";
import { PARTY_LIMITS, compareCard, validateParty, type Known, type Party } from "@/lib/loungeModel";
import { walletValue } from "@/lib/walletModel";

const usd = (value: number) => `${value < 0 ? "−" : ""}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;
const known = (value: Known<number>, format: (value: number) => string = usd) => (value === "unknown" ? "Not published" : format(value));

type FieldKey = keyof typeof PARTY_LIMITS;
const fields: { key: FieldKey; label: string; hint: string }[] = [
  { key: "adults", label: "Adults travelling (including you)", hint: "Everyone 18 or older in the party." },
  { key: "children", label: "Children aged 2-17", hint: "Under-2s are not counted here." },
  { key: "cardMembers", label: "Adults with their own card on the account", hint: "You plus any authorized users travelling." },
  { key: "visitsPerYear", label: "Lounge visits a year (as a party)", hint: "One visit = the party entering one lounge." },
];

export function LoungeGuestCalculator() {
  const [raw, setRaw] = useState<Record<FieldKey, string>>({ adults: "2", children: "2", cardMembers: "1", visitsPerYear: "6" });
  const [meetsSpendUnlock, setMeetsSpendUnlock] = useState(false);
  const [profileId, setProfileId] = useState<(typeof householdProfiles)[number]["id"]>("balanced");

  const party: Party = useMemo(
    () => ({
      adults: Number(raw.adults),
      children: Number(raw.children),
      cardMembers: Number(raw.cardMembers),
      visitsPerYear: Number(raw.visitsPerYear),
      meetsSpendUnlock,
    }),
    [raw, meetsSpendUnlock],
  );
  // Blank inputs become NaN so they fail validation instead of reading as 0.
  const errors = useMemo(() => {
    const parsed = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, value.trim() === "" ? NaN : Number(value)]));
    return validateParty({ ...party, ...parsed });
  }, [party, raw]);
  const results = useMemo(() => (errors.length ? [] : loungePolicies.map((policy) => compareCard(policy, party))), [errors, party]);
  const profile = householdProfiles.find((candidate) => candidate.id === profileId)!;
  const cardNet = (walletKey: (typeof loungePolicies)[number]["walletKey"]) =>
    walletValue([cardsFor(profileId)[walletKey]], profileSpend(profileId)).net;
  const fieldError = (key: FieldKey) => errors.find((error) => error.field === key)?.message;

  return (
    <div className="grid gap-5">
      <form className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6" onSubmit={(event) => event.preventDefault()} noValidate aria-label="Your travel party">
        <h2 className="text-xl font-semibold text-navy">Your travel party</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fields.map((field) => {
            const error = fieldError(field.key);
            return (
              <div key={field.key}>
                <label htmlFor={`lounge-${field.key}`} className="block text-sm font-bold text-navy">{field.label}</label>
                <input
                  id={`lounge-${field.key}`}
                  type="number"
                  inputMode="numeric"
                  min={PARTY_LIMITS[field.key].min}
                  max={PARTY_LIMITS[field.key].max}
                  step={1}
                  value={raw[field.key]}
                  onChange={(event) => setRaw((current) => ({ ...current, [field.key]: event.target.value }))}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={`lounge-${field.key}-hint${error ? ` lounge-${field.key}-error` : ""}`}
                  className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-base text-navy focus:outline-none focus:ring-2 focus:ring-accent-ink ${error ? "border-2 border-red-700" : "border-blue-gray"}`}
                />
                <p id={`lounge-${field.key}-hint`} className="mt-1 text-xs leading-5 text-mid-navy/70">{field.hint}</p>
                {error ? <p id={`lounge-${field.key}-error`} className="mt-1 text-sm font-semibold text-red-700">{error}</p> : null}
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 text-sm text-navy">
            <input type="checkbox" checked={meetsSpendUnlock} onChange={(event) => setMeetsSpendUnlock(event.target.checked)} className="mt-1 h-4 w-4 accent-navy" />
            <span>
              <span className="font-bold">We would spend $75,000+ a year on the Amex Platinum</span>
              <span className="block text-xs leading-5 text-mid-navy/70">Unlocks two free Centurion Lounge guests per visit. Applies only to the Platinum.</span>
            </span>
          </label>
          <div>
            <label htmlFor="lounge-profile" className="block text-sm font-bold text-navy">Household spending profile for card economics</label>
            <select id="lounge-profile" value={profileId} onChange={(event) => setProfileId(event.target.value as typeof profileId)} className="mt-1 w-full rounded-md border border-blue-gray bg-white px-3 py-2 text-base text-navy focus:outline-none focus:ring-2 focus:ring-accent-ink">
              {householdProfiles.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>{candidate.label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs leading-5 text-mid-navy/70">{profile.description}.</p>
          </div>
        </div>
      </form>

      <section aria-labelledby="lounge-results-heading" className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6">
        <h2 id="lounge-results-heading" className="text-xl font-semibold text-navy">Yearly guest cost by card</h2>
        <div aria-live="polite" aria-atomic="true">
          {errors.length ? (
            <p className="mt-3 text-base text-red-700">Fix the highlighted fields to see the comparison.</p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {results.map(({ policy, costs, cheapest }) => {
                const net = cardNet(policy.walletKey);
                return (
                  <article key={policy.cardSlug} className="rounded-lg border border-blue-gray/70 p-4" data-testid={`lounge-card-${policy.cardSlug}`}>
                    <h3 className="text-lg font-semibold text-navy">{policy.cardName}</h3>
                    <p className="text-sm text-mid-navy/75">${policy.annualFee} annual fee</p>
                    <p className="mt-3 text-2xl font-semibold text-navy" data-testid={`lounge-cheapest-${policy.cardSlug}`}>
                      {cheapest ? `${usd(cheapest.annual)} a year` : "No fully published option"}
                    </p>
                    <p className="text-sm text-mid-navy/75">
                      {cheapest ? `Cheapest published option: ${cheapest.network.name}.` : "Guest fees for this party are not published by the issuer."}
                    </p>
                    <dl className="mt-3 grid gap-1 text-sm">
                      <div className="flex justify-between gap-3"><dt className="text-mid-navy/75">Year-2 net, card alone ({profile.label.toLowerCase()})</dt><dd className="font-semibold text-navy">{usd(net)}</dd></div>
                      {cheapest ? <div className="flex justify-between gap-3"><dt className="text-mid-navy/75">After your guest fees</dt><dd className="font-semibold text-navy">{usd(net - cheapest.annual)}</dd></div> : null}
                    </dl>
                    <table className="mt-3 w-full text-left text-sm">
                      <caption className="sr-only">{policy.cardName} guest cost by lounge network</caption>
                      <thead><tr className="text-mid-navy/75"><th scope="col" className="py-1 font-semibold">Network</th><th scope="col" className="py-1 font-semibold">Per visit</th><th scope="col" className="py-1 font-semibold">Per year</th></tr></thead>
                      <tbody>
                        {costs.map((cost) => (
                          <tr key={cost.network.id} className="border-t border-blue-gray/50 align-top">
                            <th scope="row" className="py-1 pr-2 font-normal text-navy">
                              {cost.network.name}
                              {cost.exceedsMemberVisits ? <span className="block text-xs text-red-700">More visits than the {String(cost.network.memberVisits)} included</span> : null}
                            </th>
                            <td className="py-1 pr-2">{known(cost.perVisit)}</td>
                            <td className="py-1">{known(cost.annual)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-mid-navy/80">
          Guest costs use only fees the issuer publishes; &quot;Not published&quot; means the issuer page does not state a fee for that many guests, so we do not
          estimate one. Year-2 net is our wallet model for the selected household with this card alone (no welcome bonus, all fees paid). Lounge entry is
          never guaranteed: capacity limits, guest caps at individual lounges and flight-ticket rules can turn you away.
        </p>
      </section>
    </div>
  );
}
