import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/config/services";

const staticPaths = [
  "/",
  "/about",
  "/services",
  "/work",
  "/insights",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
];

function entry(path: string, lastModified: Date): MetadataRoute.Sitemap[number] {
  const basePath = path === "/" ? "" : path;
  const enUrl = `${siteConfig.url}${basePath}`;
  const ruUrl = `${siteConfig.url}/ru${basePath}`;
  return {
    url: enUrl,
    lastModified,
    alternates: { languages: { en: enUrl, ru: ruUrl } },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    const basePath = path === "/" ? "" : path;
    entries.push(entry(path, now));
    entries.push({
      url: `${siteConfig.url}/ru${basePath}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${siteConfig.url}${basePath}`,
          ru: `${siteConfig.url}/ru${basePath}`,
        },
      },
    });
  }

  for (const s of services) {
    const path = `/services/${s.slug}`;
    entries.push(entry(path, now));
    entries.push({
      url: `${siteConfig.url}/ru${path}`,
      lastModified: now,
      alternates: {
        languages: {
          en: `${siteConfig.url}${path}`,
          ru: `${siteConfig.url}/ru${path}`,
        },
      },
    });
  }

  // TODO: extend with dynamic /work/[slug] and /insights/[slug] entries once
  // Sanity is wired up — query slugs from lib/sanity/queries. Categories are
  // out of MVP scope.
  return entries;
}
