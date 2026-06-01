// ===========================================
// Cloudflare R2 Client (S3-compatible) — Khalifah TV
// ===========================================
// This file is SERVER-ONLY. Never import it in client components.
// R2 credentials are kept on the server to prevent exposure.

import { S3Client } from "@aws-sdk/client-s3";

/**
 * S3-compatible client configured for Cloudflare R2.
 *
 * Required environment variables:
 * - R2_ACCOUNT_ID: Your Cloudflare account ID
 * - R2_ACCESS_KEY_ID: R2 API token access key
 * - R2_SECRET_ACCESS_KEY: R2 API token secret key
 * - R2_BUCKET_NAME: Name of your R2 bucket
 * - R2_PUBLIC_BASE_URL: Public URL prefix for serving files
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME!;
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL!;
