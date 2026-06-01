// ===========================================
// R2 Delete API Route — Khalifah TV
// ===========================================
// Accepts a JSON body with { keys: string[] } and deletes
// those objects from Cloudflare R2.
// Used when deleting a video to clean up stored files.

import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET } from "@/lib/r2";

// TODO: Add admin authentication check here

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keys } = body as { keys: string[] };

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: "A non-empty 'keys' array is required." },
        { status: 400 }
      );
    }

    // Delete each object from R2
    const results = await Promise.allSettled(
      keys.map((key) =>
        r2Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
          })
        )
      )
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error("Some R2 deletions failed:", failed);
      return NextResponse.json(
        {
          error: `${failed.length} of ${keys.length} deletions failed.`,
          deletedCount: keys.length - failed.length,
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: keys.length,
    });
  } catch (error) {
    console.error("R2 delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete files from storage." },
      { status: 500 }
    );
  }
}
