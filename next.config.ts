import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // www.bestcardsforme.com served every page with HTTP 200, duplicating the
  // canonical apex host. Send it to the apex with one permanent redirect.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bestcardsforme.com" }],
        destination: "https://bestcardsforme.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
