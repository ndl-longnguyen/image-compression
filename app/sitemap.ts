import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date()

  const routes = [
    "",
    "/image-compressor",
    "/image-resizer",
    "/image-cropper",
    "/image-converter",
    "/image-rotate",
    "/image-editor",
  ]

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }))
}
