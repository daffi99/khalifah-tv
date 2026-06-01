"use client";

// ===========================================
// Edit Video Page — Khalifah TV
// ===========================================

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import type { Video, VideoFormData } from "@/lib/types";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminVideoPlayer } from "@/components/admin/AdminVideoPlayer";
import { LoadingState } from "@/components/admin/LoadingState";

import { Button } from "@/components/ui/button";
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

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<VideoFormData>({
    title: "",
    description: "",
    category: "",
    duration: "",
    status: "draft",
  });

  // Fetch video data
  useEffect(() => {
    async function fetchVideo() {
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .eq("id", videoId)
          .single();

        if (error || !data) {
          toast.error("Video not found.");
          router.push("/admin/videos");
          return;
        }

        setVideo(data);
        setForm({
          title: data.title,
          description: data.description ?? "",
          category: data.category,
          duration: data.duration ?? "",
          status: data.status,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load video.");
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, [videoId, router]);

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Video title is required.");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category.");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("videos")
        .update({
          title: form.title.trim(),
          description: form.description.trim() || null,
          category: form.category,
          duration: form.duration.trim() || null,
          status: form.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", videoId);

      if (error) throw error;

      toast.success("Video updated successfully!");
      router.push("/admin/videos");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update video.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Edit Video" showBack backHref="/admin/videos" />
        <LoadingState message="Loading video…" />
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Edit Video" showBack backHref="/admin/videos" />

      <main className="flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Video Preview */}
        <div className="space-y-2">
          <Label>Video Preview</Label>
          <AdminVideoPlayer
            title={video.title}
            src={video.video_url}
            poster={video.thumbnail_url}
          />
        </div>

        {/* Thumbnail Preview */}
        {video.thumbnail_url && (
          <div className="space-y-2">
            <Label>Current Thumbnail</Label>
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <Image
                src={video.thumbnail_url}
                alt="Thumbnail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Video Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={form.description}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>

          {/* Category & Duration */}
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
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
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
                disabled={isSaving}
              />
            </div>
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
              disabled={isSaving}
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
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Save Changes
              </span>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
