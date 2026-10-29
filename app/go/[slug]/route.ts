import { after } from "next/server";
import { cards } from "@/data/cards";
import { getAffiliateDestination } from "@/lib/affiliateLinks";
import { recordAnalyticsEvent } from "@/lib/analyticsServer";
import { handleGoRequest } from "@/lib/outboundClicks";

type GoRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: GoRouteProps) {
  const { slug } = await params;
  const card = cards.find((item) => item.affiliateSlug === slug);

  return handleGoRequest(request, card, getAffiliateDestination(slug), recordAnalyticsEvent, (task) => after(task));
}
