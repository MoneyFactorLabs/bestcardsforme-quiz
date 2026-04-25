"use client";

import { FormEvent, useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Detailed comparison requested:", { email });
    setSubmitted(true);
  }

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
        {submitted ? (
          <p className="rounded-md border border-gold/40 bg-white/10 px-4 py-3 text-sm font-semibold text-blue-gray">
            Thanks. Your V1 placeholder request was captured locally.
          </p>
        ) : (
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="focus-ring min-h-12 flex-1 rounded-md border border-white/20 bg-white px-4 text-navy placeholder:text-mid-navy/55"
            />
            <button
              type="submit"
              className="focus-ring min-h-12 rounded-md bg-gold px-5 text-sm font-bold text-navy transition hover:bg-[#caa42f]"
            >
              Send me the detailed comparison
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
