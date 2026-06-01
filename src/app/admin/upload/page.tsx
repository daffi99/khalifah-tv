"use client";

// ===========================================
// Upload Video Page — Khalifah TV
// ===========================================
// Handles file selection, upload to R2 via /api/upload,
// then saves metadata to Supabase.

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, FileVideo, ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import type { VideoFormData, UploadResponse } from "@/lib/types";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadVideoPage() {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [form, setForm] = useState<VideoFormData>({
    title: "",
    description: "",
    category: "",
    duration: "",
    status: "draft",
  });

  // File state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleVideoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("video/mp4") && !file.name.endsWith(".mp4")) {
        toast.error("Please select an MP4 video file.");
        return;
      }
      setVideoFile(file);
    }
  }

  function handleThumbnailSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      setThumbnailFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function clearVideo() {
    setVideoFile(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  }

  function clearThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // --- Validate ---
    if (!form.title.trim()) {
      toast.error("Video title is required.");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }
    if (!videoFile) {
      toast.error("Please select a video file.");
      return;
    }
    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload files to R2
      setUploadStep("Uploading files…");
      const formData = new FormData();
      formData.append("videoFile", videoFile);
      formData.append("thumbnailFile", thumbnailFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Upload failed");
      }

      const uploadData: UploadResponse = await uploadRes.json();

      // Step 2: Save metadata to Supabase
      setUploadStep("Saving video info…");
      const { error: dbError } = await supabase.from("videos").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        duration: form.duration.trim() || null,
        video_url: uploadData.videoUrl,
        video_key: uploadData.videoKey,
        thumbnail_url: uploadData.thumbnailUrl,
        thumbnail_key: uploadData.thumbnailKey,
        status: form.status,
      });

      if (dbError) {
        throw new Error(dbError.message || "Failed to save video metadata.");
      }

      // Step 3: Success!
      toast.success("Video uploaded successfully!");
      router.push("/admin/videos");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      setUploadStep("");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Upload Video"
        subtitle="Add a new video to Khalifah TV"
        showBack
        backHref="/admin"
      />

      <main className="flex-1 px-4 py-6 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Video Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Alif Ba Ta Song"
              value={form.title}
              onChange={handleInputChange}
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional description…"
              rows={3}
              value={form.description}
              onChange={handleInputChange}
              disabled={isUploading}
            />
          </div>

          {/* Category & Duration row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  v && setForm((prev) => ({ ...prev, category: v }))
                }
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g. 3:24"
                value={form.duration}
                onChange={handleInputChange}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Video File Upload */}
          <div className="space-y-2">
            <Label>
              Video File (MP4) <span className="text-destructive">*</span>
            </Label>
            {videoFile ? (
              <Card className="py-0 gap-0">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {videoFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={clearVideo}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <FileVideo className="h-8 w-8 opacity-50" />
                <span className="text-sm font-medium">
                  Tap to select video
                </span>
                <span className="text-xs">MP4 format</span>
              </button>
            )}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,.mp4"
              onChange={handleVideoSelect}
              className="hidden"
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label>
              Thumbnail <span className="text-destructive">*</span>
            </Label>
            {thumbnailPreview ? (
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden border border-border">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-md"
                  onClick={clearThumbnail}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <ImageIcon className="h-8 w-8 opacity-50" />
                <span className="text-sm font-medium">
                  Tap to select thumbnail
                </span>
                <span className="text-xs">JPG, PNG, or WebP</span>
              </button>
            )}
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailSelect}
              className="hidden"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                v &&
                setForm((prev) => ({
                  ...prev,
                  status: v as "published" | "draft" | "hidden",
                }))
              }
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold rounded-xl"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {uploadStep || "Uploading…"}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Save Video
              </span>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
