import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely converts an old absolute R2 URL to the new Cloudflare Worker URL.
 * It catches both .r2.dev URLs and temporary /cdn/ URLs.
 */
export function getProxyUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  const workerBase = "https://video-proxy.daffiyashir.workers.dev";
  
  if (url.startsWith("/cdn/")) {
    return `${workerBase}${url.replace("/cdn", "")}`;
  }
  
  if (url.startsWith("http") && url.includes(".r2.dev")) {
    try {
      const urlObj = new URL(url);
      return `${workerBase}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }
  return url;
}
