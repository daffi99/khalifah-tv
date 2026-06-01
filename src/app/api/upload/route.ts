// ===========================================
// R2 Upload API Route — Khalifah TV
// ===========================================
// Generates pre-signed URLs for direct-to-R2 browser uploads.
// This route runs on the server — R2 credentials are never exposed to the client.

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET, R2_PUBLIC_BASE_URL } from "@/lib/r2";

// TODO: Add admin authentication check here
// e.g., verify session/token before allowing upload

/**
 * Generate a safe, unique file key for R2.
 * Format: {folder}/{timestamp}-{random}-{sanitized-filename}
 */
function generateFileKey(folder: string, filename: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
  return `${folder}/${timestamp}-${random}-${sanitized}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoFilename, videoContentType, thumbnailFilename, thumbnailContentType } = body;

    // --- Validate inputs ---
    if (!videoFilename || !thumbnailFilename) {
      return NextResponse.json(
        { error: "Both videoFilename and thumbnailFilename are required." },
        { status: 400 }
      );
    }

    // --- Generate unique keys ---
    const videoKey = generateFileKey("videos", videoFilename);
    const thumbnailKey = generateFileKey("thumbnails", thumbnailFilename);

    // --- Generate Pre-signed URL for Video ---
    const videoCommand = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: videoKey,
      ContentType: videoContentType || "video/mp4",
    });
    // URL valid for 1 hour (3600 seconds)
    const videoPresignedUrl = await getSignedUrl(r2Client, videoCommand, { expiresIn: 3600 });

    // --- Generate Pre-signed URL for Thumbnail ---
    const thumbnailCommand = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: thumbnailKey,
      ContentType: thumbnailContentType || "image/jpeg",
    });
    const thumbnailPresignedUrl = await getSignedUrl(r2Client, thumbnailCommand, { expiresIn: 3600 });

    // --- Build public URLs ---
    const videoPublicUrl = `/cdn/${videoKey}`;
    const thumbnailPublicUrl = `/cdn/${thumbnailKey}`;

    return NextResponse.json({
      videoPresignedUrl,
      thumbnailPresignedUrl,
      videoPublicUrl,
      videoKey,
      thumbnailPublicUrl,
      thumbnailKey,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload links. Please try again." },
      { status: 500 }
    );
  }
}
