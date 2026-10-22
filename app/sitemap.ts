import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    return ["", "/pricing", "/about", "/contact", "/privacy", "/terms"].map((p) => ({
        url: `${SITE.url}${p}`,
        lastModified: "2026-10-22",
    }));
}