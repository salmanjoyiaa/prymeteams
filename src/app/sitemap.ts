import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://prymeteams.com";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/request`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/talent`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
