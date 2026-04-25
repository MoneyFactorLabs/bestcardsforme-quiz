"use client";

import { FormEvent, useState } from "react";

type LeadCaptureFormProps = {
  sourcePage: string;
  sourceCard?: string;
  inputId: string;
  buttonLabel: string;
  successMessage: string;
  variant?: "light" | "dark";
};

export function LeadCaptureForm({
  sourcePage,
  sourceCard,
  inputId,
  buttonLabel,
  successMessage,
  variant = "dark",
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "submitting" || status === "success") return;

    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source_page: sourcePage,
          source_card: sourceCard,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We could not save that request.");
      }

      setStatus("success");
      setMessage(successMessage);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again in a moment.");
    }
  }

  const isDark = variant === "dark";

  if (status === "success") {
    return (
      <p
        className={`rounded-md border px-4 py-3 text-sm font-semibold ${
          isDark
            ? "border-gold/40 bg-white/10 text-blue-gray"
            : "border-gold/60 bg-gold/10 text-navy"
        }`}
      >
        {message}
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={inputId}>
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        disabled={status === "submitting"}
        className={`focus-ring min-h-12 flex-1 rounded-md border px-4 disabled:cursor-not-allowed disabled:opacity-70 ${
          isDark
            ? "border-white/20 bg-white text-navy placeholder:text-mid-navy/55"
            : "border-blue-gray bg-white text-navy placeholder:text-mid-navy/55"
        }`}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring min-h-12 rounded-md bg-gold px-5 text-sm font-bold text-navy transition hover:bg-[#caa42f] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Saving..." : buttonLabel}
      </button>
      {status === "error" && (
        <p className={`text-sm font-semibold ${isDark ? "text-blue-gray" : "text-mid-navy"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
