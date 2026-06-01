// ===========================================
// R2 Upload API Route — Khalifah TV
// ===========================================
// Accepts FormData with videoFile and thumbnailFile,
// uploads both to Cloudflare R2, and returns public URLs + keys.
// This route runs on the server — R2 credentials are never exposed to the client.

import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
  // Sanitize filename: remove special chars, keep extension
  const sanitized = filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
  return `${folder}/${timestamp}-${random}-${sanitized}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const videoFile = formData.get("videoFile") as File | null;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;

    // --- Validate files exist ---
    if (!videoFile || !thumbnailFile) {
      return NextResponse.json(
        { error: "Both videoFile and thumbnailFile are required." },
        { status: 400 }
      );
    }

    // --- Validate video is MP4 ---
    if (!videoFile.type.includes("video/mp4") && !videoFile.name.endsWith(".mp4")) {
      return NextResponse.json(
        { error: "Video file must be MP4 format." },
        { status: 400 }
      );
    }

    // --- Validate thumbnail is an image ---
    if (!thumbnailFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Thumbnail must be an image file." },
        { status: 400 }
      );
    }

    // --- Generate unique keys ---
    const videoKey = generateFileKey("videos", videoFile.name);
    const thumbnailKey = generateFileKey("thumbnails", thumbnailFile.name);

    // --- Upload video to R2 ---
    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: videoKey,
        Body: videoBuffer,
        ContentType: videoFile.type || "video/mp4",
      })
    );

    // --- Upload thumbnail to R2 ---
    const thumbnailBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: thumbnailFile.type || "image/jpeg",
      })
    );

    // --- Build public URLs ---
    // Ensure no double slashes if R2_PUBLIC_BASE_URL has a trailing slash
    const baseUrl = R2_PUBLIC_BASE_URL.replace(/\/+$/, "");
    const videoUrl = `${baseUrl}/${videoKey}`;
    const thumbnailUrl = `${baseUrl}/${thumbnailKey}`;

    return NextResponse.json({
      videoUrl,
      videoKey,
      thumbnailUrl,
      thumbnailKey,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files to storage. Please try again." },
      { status: 500 }
    );
  }
}
