"use client";

import { useMemo, useState } from "react";
import { FIELD_LIMITS, computeBreakEven, parseInputs, presets, type FieldName } from "@/lib/feeBreakEven";

type Field = { name: FieldName; label: string; hint: string; prefix?: string; suffix?: string; step: string };

const fields: Field[] = [
  { name: "annualFee", label: "Annual fee", hint: "The fee you pay every year after the first.", prefix: "$", step: "1" },
  { name: "bonusSpend", label: "Yearly spend in the card's bonus categories", hint: "Only spend that earns the higher rate, within any cap.", prefix: "$", step: "100" },
  { name: "bonusRate", label: "Bonus-category earn rate", hint: "Points or miles per dollar, e.g. 4 for 4x.", suffix: "x", step: "0.5" },
  { name: "otherSpend", label: "Yearly spend on everything else on this card", hint: "Leave at 0 if this spend goes on a different card.", prefix: "$", step: "100" },
  { name: "otherRate", label: "Earn rate on everything else", hint: "Points or miles per dollar.", suffix: "x", step: "0.5" },
  { name: "centsPerPoint", label: "Value per point, in cents", hint: "Use 1 if you will cash points out; transfers can be worth more.", suffix: "¢", step: "0.1" },
  { name: "creditsUsed", label: "Credits you would use anyway, per year", hint: "Count only what replaces spending you would do regardless.", prefix: "$", step: "10" },
];

const usd = (value: number) =>
  `${value < 0 ? "−" : ""}$${Math.round(Math.abs(value)).toLocaleString("en-US")}`;

const initial = presets[0];
const initialValues: Record<FieldName, string> = {
  annualFee: String(initial.values.annualFee),
  bonusSpend: "12000",
  bonusRate: String(initial.values.bonusRate),
  otherSpend: "0",
  otherRate: String(initial.values.otherRate),
  centsPerPoint: String(initial.values.centsPerPoint),
  creditsUsed: "0",
};

export function FeeBreakEvenCalculator() {
  const [values, setValues] = useState(initialValues);
  const [presetId, setPresetId] = useState(initial.id);
  const { inputs, errors } = useMemo(() => parseInputs(values), [values]);
  const result = useMemo(() => (inputs ? computeBreakEven(inputs) : null), [inputs]);
  const preset = presets.find((candidate) => candidate.id === presetId);

  function applyPreset(id: string) {
    setPresetId(id);
    const chosen = presets.find((candidate) => candidate.id === id);
    if (!chosen) return;
    setValues((current) => ({
      ...current,
      annualFee: String(chosen.values.annualFee),
      bonusRate: String(chosen.values.bonusRate),
      otherRate: String(chosen.values.otherRate),
      centsPerPoint: String(chosen.values.centsPerPoint),
    }));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <form
        className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6"
        onSubmit={(event) => event.preventDefault()}
        noValidate
        aria-label="Annual-fee break-even inputs"
      >
        <label htmlFor="fee-preset" className="block text-sm font-bold text-navy">
          Start from a card (optional)
        </label>
        <select
          id="fee-preset"
          value={presetId}
          onChange={(event) => applyPreset(event.target.value)}
          aria-describedby="fee-preset-note"
          className="mt-2 w-full rounded-md border border-blue-gray bg-white px-3 py-2 text-base text-navy focus:outline-none focus:ring-2 focus:ring-gold"
        >
          {presets.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.label}
            </option>
          ))}
          <option value="custom">Custom card</option>
        </select>
        <p id="fee-preset-note" className="mt-2 text-sm leading-6 text-mid-navy/75">
          {preset ? preset.note : "Enter the fee and earn rates from the card's terms."} Presets fill the fee, earn rates and
          our point value; you supply the spend and credits.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const error = errors[field.name];
            const hintId = `${field.name}-hint`;
            const errorId = `${field.name}-error`;
            const { min, max } = FIELD_LIMITS[field.name];
            return (
              <div key={field.name}>
                <label htmlFor={field.name} className="block text-sm font-bold text-navy">
                  {field.label}
                </label>
                <div
                  className={`mt-1 flex items-center rounded-md border bg-white focus-within:ring-2 focus-within:ring-gold ${
                    error ? "border-2 border-red-700" : "border-blue-gray"
                  }`}
                >
                  {field.prefix ? <span className="pl-3 text-mid-navy/70" aria-hidden="true">{field.prefix}</span> : null}
                  <input
                    id={field.name}
                    name={field.name}
                    type="number"
                    inputMode="decimal"
                    min={min}
                    max={max}
                    step={field.step}
                    value={values[field.name]}
                    onChange={(event) => {
                      const next = event.target.value;
                      setValues((current) => ({ ...current, [field.name]: next }));
                      if (["annualFee", "bonusRate", "otherRate", "centsPerPoint"].includes(field.name)) setPresetId("custom");
                    }}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${hintId} ${errorId}` : hintId}
                    className="w-full min-w-0 rounded-md bg-transparent px-3 py-2 text-base text-navy focus:outline-none"
                  />
                  {field.suffix ? <span className="pr-3 text-mid-navy/70" aria-hidden="true">{field.suffix}</span> : null}
                </div>
                <p id={hintId} className="mt-1 text-xs leading-5 text-mid-navy/70">
                  {field.hint}
                </p>
                {error ? (
                  <p id={errorId} className="mt-1 text-sm font-semibold text-red-700">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </form>

      <section
        aria-labelledby="fee-result-heading"
        className="rounded-lg border border-blue-gray/70 bg-navy p-5 text-white shadow-soft sm:p-6"
      >
        <h2 id="fee-result-heading" className="text-lg font-semibold">
          Year-2 result
        </h2>
        <div aria-live="polite" aria-atomic="true">
          {result ? (
            <>
              <p className="mt-3 text-3xl font-semibold" data-testid="fee-verdict">
                {result.verdict === "beats-baseline"
                  ? `Beats a no-fee 2% card by ${usd(result.vsBaseline)} a year`
                  : result.verdict === "ties-baseline"
                    ? "Ties a no-fee 2% card"
                    : `Trails a no-fee 2% card by ${usd(-result.vsBaseline)} a year`}
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div><dt className="text-white/70">Rewards</dt><dd className="text-lg font-semibold">{usd(result.rewards)}</dd></div>
                <div><dt className="text-white/70">Credits used</dt><dd className="text-lg font-semibold">{usd(result.credits)}</dd></div>
                <div><dt className="text-white/70">Net after the fee</dt><dd className="text-lg font-semibold">{usd(result.net)}</dd></div>
                <div><dt className="text-white/70">Same spend on a 2% card</dt><dd className="text-lg font-semibold">{usd(result.baseline)}</dd></div>
              </dl>
              <h3 className="mt-6 font-semibold text-gold">Break-even points</h3>
              <ul className="mt-2 grid gap-2 text-sm leading-6">
                <li>
                  {result.creditsToBreakEven === 0
                    ? "Rewards alone already cover the fee against a 2% card; credits are a bonus."
                    : `You need ${usd(result.creditsToBreakEven)} a year in credits you would use anyway to tie a 2% card at this spend.`}
                </li>
                <li>
                  {result.bonusSpendToBreakEven === null
                    ? "No amount of bonus-category spend closes the gap: at this point value the bonus rate does not beat 2%."
                    : result.bonusSpendToBreakEven === 0
                      ? "Your credits and other spend already cover the fee, so any bonus-category spend is a gain."
                      : `Tie point: ${usd(result.bonusSpendToBreakEven)} a year in bonus categories, with your other inputs unchanged.`}
                </li>
              </ul>
            </>
          ) : (
            <p className="mt-3 text-base leading-7">Fix the highlighted fields to see the result.</p>
          )}
        </div>
      </section>
    </div>
  );
}
