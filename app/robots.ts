import { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/config-server";
import { buildRobots } from "@/lib/seo-routes";

export default function robots(): MetadataRoute.Robots {
  return buildRobots(getSiteConfig().site.url);
}
