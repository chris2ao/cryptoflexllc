import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllResources } from "@/lib/resources";
import { BASE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  // Use the most recent post date for pages that aggregate blog content
  const latestPostDate = posts.length > 0
    ? new Date(posts[0].date)
    : new Date("2026-02-01");

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestPostDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: new Date("2026-04-17"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/guestbook`,
      lastModified: new Date("2026-02-20"),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/skills`,
      lastModified: new Date("2026-04-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const resources = getAllResources();
  const resourceEntries: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE_URL}/resources/${r.slug}`,
    lastModified: new Date(r.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...blogEntries, ...resourceEntries];
}
