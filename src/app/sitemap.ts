import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nutzh.top";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/my-writeups`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/projects`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const posts = getAllPosts().map((post) => ({
    url: `${base}/${post.slug.join("/")}`,
    lastModified: post.meta.date ? new Date(post.meta.date) : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...posts];
}
