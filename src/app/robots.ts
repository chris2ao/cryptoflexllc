import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/analytics", "/analytics/", "/api/"],
      },
    ],
    sitemap: "https://www.cryptoflexllc.com/sitemap.xml",
  };
}
