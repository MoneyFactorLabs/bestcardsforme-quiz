export const siteConfig = {
  name: "BestCardsForMe by MoneyFactor",
  url: "https://bestcardsforme.com",
  description:
    "Find the credit card that actually fits your lifestyle using honest annual-value math.",
};

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
