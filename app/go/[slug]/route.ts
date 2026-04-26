import { redirect } from "next/navigation";
import { getAffiliateDestination } from "@/lib/affiliateLinks";

type GoRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: GoRouteProps) {
  const { slug } = await params;

  redirect(getAffiliateDestination(slug));
}
