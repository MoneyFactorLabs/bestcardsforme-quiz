import { articles } from "@/data/articles";
import { weightedOverall } from "@/lib/cardProfileBuilder";
import type { CreditCard } from "@/types/card";
import type { CreditCardProfile } from "@/types/creditCardProfile";

// Strings that must never reach a published profile.
const placeholderPatterns = [/details pending/i, /\bTBD\b/, /\bTODO\b/, /lorem ipsum/i, /placeholder/i];

// Hand-scored overall values may differ from the weighted formula by editorial
// judgment, but not by more than this.
const OVERALL_TOLERANCE = 0.6;
const META_DESCRIPTION_MAX = 170;

function collectStrings(value: unknown, out: string[] = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, out));

  return out;
}

function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export function validateCardProfiles(profiles: CreditCardProfile[], cards: CreditCard[]) {
  const errors: string[] = [];
  const articleSlugs = new Set(articles.map((article) => article.slug));
  const profileSlugs = new Set(profiles.map((profile) => profile.slug));

  cards.forEach((card) => {
    if (!profileSlugs.has(card.id)) errors.push(`${card.id}: quiz card has no card profile`);
  });

  profiles.forEach((profile) => {
    const at = (message: string) => errors.push(`${profile.slug}: ${message}`);
    const card = cards.find((item) => item.id === profile.slug);

    // The placeholder check skips the affiliate status enum, whose value is literally "placeholder".
    const { affiliateStatus: _affiliateStatus, ...publishedFields } = profile;
    collectStrings(publishedFields).forEach((text) => {
      placeholderPatterns.forEach((pattern) => {
        if (pattern.test(text)) at(`placeholder text "${text.slice(0, 60)}"`);
      });
    });

    if (!profile.issuer.trim()) at("missing issuer");
    if (card && card.annualFee !== profile.annualFee) {
      at(`annual fee $${profile.annualFee} disagrees with quiz card data ($${card.annualFee})`);
    }
    if (!isIsoDate(profile.reviewedAt)) at(`invalid reviewedAt "${profile.reviewedAt}"`);
    if (profile.factCheck && !isIsoDate(profile.factCheck.checkedAt)) at("invalid factCheck.checkedAt");

    profile.relatedArticleSlugs.forEach((slug) => {
      if (!articleSlugs.has(slug)) at(`related article "${slug}" does not exist`);
    });
    profile.alternatives?.forEach(({ slug }) => {
      if (slug === profile.slug) at("lists itself as an alternative");
      else if (!profileSlugs.has(slug)) at(`alternative "${slug}" has no card profile`);
    });

    if (profile.metaDescription && profile.metaDescription.length > META_DESCRIPTION_MAX) {
      at(`meta description is ${profile.metaDescription.length} chars (max ${META_DESCRIPTION_MAX})`);
    }

    if (profile.scoreStatus !== "withheld") {
      const scores = profile.moneyFactorScores;
      Object.entries(scores).forEach(([key, value]) => {
        if (value < 0 || value > 10) at(`score ${key}=${value} is outside 0-10`);
      });
      const expected = weightedOverall(scores, profile.scoringCategory ?? "travel");
      if (Math.abs(expected - scores.overall) > OVERALL_TOLERANCE) {
        at(`overall ${scores.overall} is inconsistent with weighted sub-scores (${expected})`);
      }
    } else if (!profile.factCheck?.flags.some((flag) => flag.status !== "verified")) {
      at("score is withheld without a fact-check flag explaining why");
    }

    if (profile.factCheck && !profile.valueAnalysis && profile.scoreStatus !== "withheld") {
      at("generated profile has no value analysis");
    }
  });

  return errors;
}

export function assertValidCardProfiles(profiles: CreditCardProfile[], cards: CreditCard[]) {
  const errors = validateCardProfiles(profiles, cards);

  if (errors.length > 0) {
    throw new Error(`Card profile validation failed:\n- ${errors.join("\n- ")}`);
  }
}
