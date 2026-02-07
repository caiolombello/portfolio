import { headers } from 'next/headers';
import { getSiteConfigEdge } from './config-edge';

/**
 * Load site config for OG image generation (Edge Runtime).
 * Derives the base URL from the request headers.
 */
export async function getOgSiteConfig() {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  let baseUrl = `${protocol}://${host}`;
  if (!host && process.env.VERCEL_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  }

  return getSiteConfigEdge(baseUrl);
}

/**
 * Extract a short domain label from a full URL.
 * e.g. "https://example.com" -> "example.com"
 */
export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, '');
  }
}
