import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts an old absolute R2 URL to the Vercel proxy URL.
 * It leaves already proxied (/cdn/...) URLs completely untouched.
 */
export function getProxyUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http") && url.includes(".r2.dev")) {
    try {
      const urlObj = new URL(url);
      return `/cdn${urlObj.pathname}`;
    } catch {
      return url;
    }
  }
  return url;
}
