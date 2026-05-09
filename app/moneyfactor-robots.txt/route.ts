export const dynamic = "force-static";

export function GET() {
  return new Response(
    `User-Agent: *
Allow: /

Host: moneyfactor.io
Sitemap: https://moneyfactor.io/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
}
