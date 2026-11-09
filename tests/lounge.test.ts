import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FAMILY_PARTY, familyExample, getLoungePolicy, loungePolicies } from "@/data/loungePolicies";
import { compareCard, networkCost, validateParty, type Party } from "@/lib/loungeModel";
import claimsRegistry from "@/quality/issuer-claims.json";

const ROUTE = "/credit-card-lounge-access";
const network = (card: string, id: string) => getLoungePolicy(card)!.networks.find((candidate) => candidate.id === id)!;
const party = (overrides: Partial<Party> = {}): Party => ({ ...FAMILY_PARTY, ...overrides });
type Products = Record<string, { usedIn: string[]; claims: { id: string; text: string }[] }>;
const products = claimsRegistry.products as unknown as Products;

test("Reserve Priority Pass: two free guests per card member, then $27", () => {
  // 2 adults + 2 children, one card member: 3 guests, 2 free (adult first), 1 child pays $27.
  const solo = networkCost(network("chase-sapphire-reserve", "priority-pass"), party());
  assert.equal(solo.payingAdults, 0);
  assert.equal(solo.payingChildren, 1);
  assert.equal(solo.perVisit, 27);
  assert.equal(solo.annual, 162);
  // An authorized user brings their own two free guests: the family enters free.
  assert.equal(networkCost(network("chase-sapphire-reserve", "priority-pass"), party({ cardMembers: 2 })).annual, 0);
});

test("Platinum Centurion: every guest pays until the $75,000 spend unlock", () => {
  const centurion = network("amex-platinum", "centurion");
  // $50 adult + 2 × $30 children = $110 a visit.
  assert.equal(networkCost(centurion, party()).perVisit, 110);
  assert.equal(networkCost(centurion, party()).annual, 660);
  // After the unlock two guests are free (the adult and one child); one child pays $30.
  assert.equal(networkCost(centurion, party({ meetsSpendUnlock: true })).perVisit, 30);
  // A solo traveller pays nothing.
  assert.equal(networkCost(centurion, party({ adults: 1, children: 0 })).annual, 0);
});

test("unknown fees and authorized-user rules stay unknown instead of being guessed", () => {
  // Third guest at a Platinum Priority Pass lounge: Amex does not publish the fee.
  assert.equal(networkCost(network("amex-platinum", "priority-pass"), party()).perVisit, "unknown");
  // Two card members on Venture X: Capital One does not state authorized-user access.
  assert.equal(networkCost(network("capital-one-venture-x", "capital-one-lounges"), party({ cardMembers: 2 })).annual, "unknown");
  // Within the free allowance the cost is known to be zero even if the extra-guest fee is not.
  assert.equal(networkCost(network("capital-one-venture-x", "capital-one-lounges"), party({ children: 1 })).annual, 0);
});

test("Delta Sky Club visit cap is flagged and excluded from the cheapest option", () => {
  const cost = networkCost(network("amex-platinum", "delta-sky-club"), party({ adults: 1, children: 0, visitsPerYear: 12 }));
  assert.equal(cost.exceedsMemberVisits, true);
  const best = compareCard(getLoungePolicy("amex-platinum")!, party({ adults: 1, children: 0, visitsPerYear: 12 })).cheapest;
  assert.notEqual(best?.network.id, "delta-sky-club");
});

test("family example used on the page", () => {
  const fx = familyExample();
  assert.equal(fx.reservePriorityPass.annual, 162);
  assert.equal(fx.reservePriorityPassWithAu.annual, 0);
  assert.equal(fx.platinumCenturion.perVisit, 110);
  assert.equal(fx.platinumCenturion75k.perVisit, 30);
  const cheapest = Object.fromEntries(fx.cheapest.map((result) => [result.policy.cardSlug, result.cheapest?.annual]));
  // Platinum's cheapest fully published option is Centurion at $660 (Priority Pass third-guest fee unpublished).
  assert.deepEqual(cheapest, { "chase-sapphire-reserve": 162, "amex-platinum": 660, "capital-one-venture-x": undefined });
});

test("party validation", () => {
  assert.deepEqual(validateParty(party()), []);
  assert.equal(validateParty(party({ adults: 0 }))[0].field, "adults");
  assert.equal(validateParty(party({ children: 1.5 }))[0].field, "children");
  assert.equal(validateParty(party({ visitsPerYear: Number.NaN }))[0].field, "visitsPerYear");
  assert.equal(validateParty(party({ cardMembers: 3 }))[0].field, "cardMembers");
});

test("every lounge rule is backed by a registered issuer claim used on the lounge page", () => {
  for (const policy of loungePolicies) {
    for (const row of policy.networks) {
      assert.ok(row.claims.length > 0, `${policy.cardSlug}/${row.id} has no claim`);
      const texts = row.claims.map((ref) => {
        const [productId, claimId] = ref.split("/");
        const product = products[productId];
        assert.ok(product, `${ref}: unknown product`);
        assert.ok(product.usedIn.includes(ROUTE), `${productId} usedIn lacks ${ROUTE}`);
        const claim = product.claims.find((candidate) => candidate.id === claimId);
        assert.ok(claim, `${ref}: unknown claim`);
        return claim.text;
      });
      const joined = texts.join(" ");
      // Published numbers must appear in the claim text that backs them.
      if (typeof row.guestFee === "number") assert.ok(joined.includes(`$${row.guestFee}`), `${policy.cardSlug}/${row.id} fee not in claims`);
      if (row.childGuestFee !== undefined) assert.ok(joined.includes(`$${row.childGuestFee}`), `${policy.cardSlug}/${row.id} child fee`);
      if (row.spendUnlock) assert.ok(joined.includes(`$${row.spendUnlock.spend.toLocaleString("en-US")}`), `${policy.cardSlug}/${row.id} unlock`);
      if (typeof row.memberVisits === "number") assert.ok(joined.includes(String(row.memberVisits)), `${policy.cardSlug}/${row.id} visits`);
      // No invented unlimited access.
      assert.notEqual(row.memberVisits, "unlimited");
    }
  }
});

test("lounge page is in the sitemap and linked from the card pages", () => {
  assert.ok(readFileSync("app/sitemap.ts", "utf8").includes(`"${ROUTE}"`));
  assert.ok(readFileSync("app/cards/[slug]/page.tsx", "utf8").includes(ROUTE));
});
