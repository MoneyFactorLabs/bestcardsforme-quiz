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
    <section className="rounded-lg bg-navy p-5 text-white shadow-soft sm:p-7">
      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Detailed comparison</p>
          <h2 className="mt-2 text-2xl font-semibold">Want the full honest-math breakdown?</h2>
        </div>
        {submitted ? (
          <p className="rounded-md bg-white/10 px-4 py-3 text-sm font-semibold text-blue-gray">
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
