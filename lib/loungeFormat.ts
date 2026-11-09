import type { Known, NetworkAccess } from "@/lib/loungeModel";

// Display text for lounge policy fields, shared by the lounge hub, the network guide
// and card pages so every view words the same verified data the same way.
export const usd = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;
export const showKnown = (value: Known<number>, format = usd) => (value === "unknown" ? "Not published" : format(value));

export const freeGuestsText = (access: NetworkAccess) =>
  access.freeGuests === "unknown"
    ? "Not published"
    : `${access.freeGuests}${access.spendUnlock ? ` (${access.spendUnlock.freeGuests} after ${usd(access.spendUnlock.spend)} spend)` : ""}`;

export const guestFeeText = (access: NetworkAccess) =>
  access.guestFee === "unknown"
    ? "Not published"
    : `${usd(access.guestFee)}${access.childGuestFee !== undefined ? ` (${usd(access.childGuestFee)} ages 2-17)` : ""}`;

export const authorizedUsersText = (access: NetworkAccess) =>
  access.authorizedUsers === "included" ? "Yes, own access" : access.authorizedUsers === "not-included" ? "No" : "Not stated";

export const visitsText = (access: NetworkAccess) =>
  access.memberVisits === "unknown" ? "Cap not published" : access.memberVisits === "unlimited" ? "Unlimited" : `${access.memberVisits} a year`;
