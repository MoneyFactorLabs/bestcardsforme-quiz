import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Contact | BestCardsForMe by MoneyFactor",
};

const contactSections = [
  {
    heading: "Editorial and corrections",
    body: "If you see outdated card terms, unclear review language, or a factual issue that could affect consumer value, send a note with the page URL and the issue you noticed.",
  },
  {
    heading: "Partnership inquiries",
    body: "Partnership and issuer-network inquiries are welcome, but commercial relationships do not control MoneyFactor scoring or editorial rankings.",
  },
  {
    heading: "Privacy or removal requests",
    body: "For privacy, data, or email-removal requests, include the email address involved and enough context for us to locate the request.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="mx-auto w-full max-w-4xl px-4 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-12">
        <header className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Contact</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-navy sm:text-5xl">
            Contact BestCardsForMe by MoneyFactor
          </h1>
          <p className="mt-4 text-base leading-8 text-mid-navy/75 sm:text-lg">
            Send editorial corrections, partnership inquiries, and privacy requests to{" "}
            <Link href="mailto:tim@moneyfactor.io" className="font-semibold text-navy underline">
              tim@moneyfactor.io
            </Link>
            .
          </p>
        </header>

        <div className="mt-5 grid gap-5">
          {contactSections.map((section) => (
            <article
              key={section.heading}
              className="rounded-lg border border-blue-gray/70 bg-white p-5 shadow-soft sm:p-6"
            >
              <h2 className="text-xl font-semibold text-navy">{section.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-mid-navy/75">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
