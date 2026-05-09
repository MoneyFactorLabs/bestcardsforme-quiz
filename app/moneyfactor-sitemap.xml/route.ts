const moneyFactorUrl = "https://moneyfactor.io/";

export const dynamic = "force-static";

export function GET() {
  const lastModified = new Date().toISOString();
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>${moneyFactorUrl}</loc>
<lastmod>${lastModified}</lastmod>
</url>
</urlset>
`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
