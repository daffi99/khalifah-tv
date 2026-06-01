// ===========================================
// Video type definitions for Khalifah TV
// ===========================================

export type VideoStatus = "published" | "draft" | "hidden";

export type VideoCategory = "songs" | "learning" | "stories" | "dua" | "animals";

/**
 * Represents a video row from the Supabase `videos` table.
 */
export interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  duration: string | null;
  video_url: string;
  video_key: string;
  thumbnail_url: string;
  thumbnail_key: string;
  status: VideoStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Form data for creating or editing a video.
 */
export interface VideoFormData {
  title: string;
  description: string;
  category: string;
  duration: string;
  status: VideoStatus;
}

/**
 * Response from the /api/upload endpoint.
 */
export interface UploadResponse {
  videoUrl: string;
  videoKey: string;
  thumbnailUrl: string;
  thumbnailKey: string;
}

/**
 * Stats displayed on the admin dashboard.
 */
export interface VideoStats {
  total: number;
  published: number;
  draft: number;
  hidden: number;
}
