import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BestCardsForMe Quiz by MoneyFactor",
  description:
    "Find the credit card that actually fits your lifestyle using honest annual-value math.",
  verification: {
    google: "wGAUXA7ZlmxxBFfmgzhvF0Lyt280_MY9BcVqyDyBgLY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
